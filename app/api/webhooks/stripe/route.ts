import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { enviarParaCarrinhoMelhorEnvio } from "@/lib/actions/melhor-envio";
import { revalidateProductById, revalidateProductsList } from "@/lib/actions/revalidate";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  console.log("[WEBHOOK STRIPE] Iniciando processamento de evento...");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const metadata = session.metadata || {};

    try {
      console.log("[WEBHOOK STRIPE] Sessão concluída. Extraindo metadados para criação do pedido...");

      // 1. Desserializar os dados salvos no metadata (com suporte completo a chunks)
      const userData = JSON.parse(metadata.userData || "{}");
      const shippingData = JSON.parse(metadata.shippingData || "{}");

      let minimalItems: any[] = [];
      const chunksCount = parseInt(metadata.itemsChunksCount || "0", 10);

      if (chunksCount > 0) {
        for (let i = 1; i <= chunksCount; i++) {
          const chunkStr = metadata[`itemsData_${i}`];
          if (chunkStr) {
            minimalItems = minimalItems.concat(JSON.parse(chunkStr));
          }
        }
      } else if (metadata.itemsData) {
        minimalItems = JSON.parse(metadata.itemsData);
      }

      const isPickup = shippingData.id === "pickup";
      const isLocalDelivery = shippingData.id === "local";
      const isBetterShipping = !isPickup && !isLocalDelivery;

      // Status inicial padrão
      const statusInicial = metadata.status || "Em Preparação";

      // 2. Inserir o pedido principal no banco de dados
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: metadata.userId,
          total: Number(metadata.total),
          status: statusInicial,
          shipping_type: metadata.shippingType,
          tracking_code:
            isPickup || isLocalDelivery
              ? "Não rastreável"
              : shippingData.tracking_code || null,
          shipping_name: userData.name,
          shipping_address: userData.address,
          shipping_city: userData.city,
          shipping_state: userData.state,
          shipping_zip: userData.zip,
          shipping_phone: userData.phone,
          shipping_email: userData.email,
          shipping_document: userData.document,
          shipping_cost: Number(shippingData.price),
          shipping_service_id: String(shippingData.id),
          shipping_company_name: isBetterShipping
            ? shippingData.company?.name
            : shippingData.name,
          total_weight: Number(metadata.calculatedWeight),
          estimated_delivery: metadata.calculatedDeliveryDate,
          payment_status: "Pago",
        })
        .select("id")
        .single();

      if (orderError || !order) {
        console.error("Erro ao salvar pedido no Supabase via Webhook:", orderError);
        throw new Error("Erro ao criar pedido: " + (orderError?.message || "Desconhecido"));
      }

      console.log(`[WEBHOOK STRIPE] Pedido ${order.id} criado com sucesso no banco.`);

      // 3. Buscar dados completos de cada produto no Supabase usando o ID mínimo enviado
      const itemsToInsert = [];
      for (const item of minimalItems) {
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("*")
          .eq("id", item.id)
          .single();

        if (product) {
          itemsToInsert.push({
            order_id: order.id,
            product_id: product.id,
            product_name: product.nome,
            product_image: product.imagem_url,
            unit_price: item.p, // Preço efetivo (já com o desconto promocional aplicado no checkout)
            quantity: item.q,
            item_weight: product.weight || 0,
            item_width: product.width || 0,
            item_height: product.height || 0,
            item_length: product.length || 0,
          });
        }
      }

      const { data: insertedItems, error: itemsError } = await supabaseAdmin
        .from("order_items")
        .insert(itemsToInsert)
        .select("*");

      if (itemsError) {
        console.error("Erro ao salvar itens do pedido:", itemsError);
        throw new Error("Erro ao salvar itens do pedido");
      }

      // 4. ATUALIZAÇÃO DE ESTOQUE (Suportando variant_sizes e estoque geral)
      for (const item of minimalItems) {
        if (item.id) {
          // Atualiza o estoque do tamanho específico (variant_size_id / sz) se houver
          if (item.sz) {
            const { data: sizeData, error: sizeErr } = await supabaseAdmin
              .from("variant_sizes")
              .select("estoque")
              .eq("id", item.sz)
              .single();

            if (!sizeErr && sizeData) {
              const novoEstoqueTamanho = Math.max(0, sizeData.estoque - item.q);
              await supabaseAdmin
                .from("variant_sizes")
                .update({ estoque: novoEstoqueTamanho })
                .eq("id", item.sz);
              
              console.log(`Estoque do tamanho ID ${item.sz} atualizado para ${novoEstoqueTamanho}`);
            }
          }

          // Atualiza o estoque geral na tabela products
          const { data: product, error: prodError } = await supabaseAdmin
            .from("products")
            .select("estoque")
            .eq("id", item.id)
            .single();

          if (!prodError && product) {
            const novoEstoque = Math.max(0, product.estoque - item.q);

            await supabaseAdmin
              .from("products")
              .update({ estoque: novoEstoque })
              .eq("id", item.id);
            
            revalidateProductById(item.id);
            revalidateProductsList();
            console.log(`Estoque geral do produto ${item.id} atualizado para ${novoEstoque}`);
          }
        }
      }

      // 5. INTEGRAÇÃO COM MELHOR ENVIO
      if (metadata.shippingType === 'retirada' || metadata.shippingType === 'entrega_propria') {
        console.log(`[WEBHOOK STRIPE] Pedido ${order.id} local. Nenhuma ação externa necessária.`);
      } else {
        console.log(`[WEBHOOK STRIPE] Enviando pedido ${order.id} para o carrinho do Melhor Envio...`);
        try {
          await enviarParaCarrinhoMelhorEnvio({
            shipping: {
              id: shippingData.id, 
              name: userData.name,
              address: userData.address,
              city: userData.city,
              zip: userData.zip,
              phone: userData.phone,
              email: userData.email,
              document: userData.document
            },
            items: insertedItems,
            orderId: order.id
          });
          
          console.log(`[WEBHOOK STRIPE] Item adicionado ao carrinho do Melhor Envio com sucesso!`);
        } catch (integrationError) {
          console.error("❌ Falha na integração com Melhor Envio:", integrationError);
          await supabaseAdmin
            .from("orders")
            .update({ status: "Erro de Integração" })
            .eq("id", order.id);
        }
      }
      
    } catch (error) {
      console.error("[WEBHOOK STRIPE] Erro interno:", error);
      return new NextResponse("Erro processando pedido", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}