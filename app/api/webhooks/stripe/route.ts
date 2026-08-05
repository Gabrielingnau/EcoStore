import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { enviarParaCarrinhoMelhorEnvio } from "@/lib/actions/melhor-envio";
import { revalidateProductFull } from "@/lib/actions/revalidate";

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

      // 1. Desserializar os dados salvos no metadata
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

      console.log("[WEBHOOK STRIPE] Itens recuperados do metadata:", JSON.stringify(minimalItems, null, 2));

      const isPickup = shippingData.id === "pickup";
      const isLocalDelivery = shippingData.id === "local";
      const isBetterShipping = !isPickup && !isLocalDelivery;

      const evaluatedCompanyName = isBetterShipping
        ? shippingData.company
        : shippingData.name;

      const statusInicial = metadata.status

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
          shipping_company_name: evaluatedCompanyName,
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

      // 3. Montar itens para salvar em order_items resolvendo a imagem e variantes com logs de debug
      const itemsToInsert = [];
      for (const item of minimalItems) {
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("*")
          .eq("id", item.id)
          .single();

        if (product) {
          let variantImage = product.imagem_url;
          let variantColor = item.cor || null;
          let variantSize = item.tamanho || item.size || null;

          // Mapeia todas as possíveis chaves que o checkout pode enviar para o ID da variante e tamanho
          const variantId = item.variantId || item.v || item.variant_id || null;
          const sizeId = item.sizeId || item.sz || item.variant_size_id || null;

          console.log(`[DEBUG ITEM] Processando produto ID: ${item.id}, variantId detectado: ${variantId}, sizeId detectado: ${sizeId}`);

          if (variantId) {
            const { data: variantData, error: varErr } = await supabaseAdmin
              .from("product_variants")
              .select("cor, imagens")
              .eq("id", variantId)
              .single();

            if (varErr) {
              console.error(`[DEBUG ITEM] Erro ao buscar variant_id ${variantId}:`, varErr.message);
            }

            if (variantData) {
              if (variantData.cor) variantColor = variantData.cor;
              
              // Garante a extração correta da 1ª imagem do array jsonb
              if (variantData.imagens) {
                let parsedImages = variantData.imagens;
                if (typeof parsedImages === "string") {
                  try {
                    parsedImages = JSON.parse(parsedImages);
                  } catch (e) {
                    console.error("[DEBUG ITEM] Erro ao parsear JSON de imagens da variante:", e);
                  }
                }

                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  variantImage = parsedImages[0];
                  console.log(`[DEBUG ITEM] Imagem da variante encontrada com sucesso: ${variantImage}`);
                }
              }
            }
          } else {
            console.log(`[DEBUG ITEM] Produto ${item.id} sem variantId. Usando imagem padrão do produto: ${variantImage}`);
          }

          if (sizeId) {
            const { data: sizeData } = await supabaseAdmin
              .from("variant_sizes")
              .select("tamanho")
              .eq("id", sizeId)
              .single();

            if (sizeData && sizeData.tamanho) {
              variantSize = sizeData.tamanho;
            }
          }

          itemsToInsert.push({
            order_id: order.id,
            product_id: product.id,
            product_name: product.nome,
            product_image: variantImage,
            unit_price: item.p,
            quantity: item.q,
            item_weight: product.weight || 0,
            item_width: product.width || 0,
            item_height: product.height || 0,
            item_length: product.length || 0,
            variant_id: variantId,
            variant_size_id: sizeId,
            cor: variantColor,
            tamanho: variantSize,
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

      // 4. CONTROLE DE ESTOQUE
      const stockUpdatesMap = new Map<string, { productId: string; sizeId?: string; quantity: number }>();

      for (const item of minimalItems) {
        if (!item.id) continue;
        const sizeId = item.sizeId || item.sz || item.variant_size_id;
        const key = `${item.id}_${sizeId || 'no_size'}`;

        if (stockUpdatesMap.has(key)) {
          stockUpdatesMap.get(key)!.quantity += Number(item.q || 0);
        } else {
          stockUpdatesMap.set(key, {
            productId: item.id,
            sizeId: sizeId || undefined,
            quantity: Number(item.q || 0),
          });
        }
      }

      const productIdsToRevalidate = new Set<string>();

      for (const [, updateInfo] of stockUpdatesMap) {
        productIdsToRevalidate.add(updateInfo.productId);

        if (updateInfo.sizeId) {
          const { data: sizeData, error: sizeErr } = await supabaseAdmin
            .from("variant_sizes")
            .select("estoque")
            .eq("id", updateInfo.sizeId)
            .single();

          if (!sizeErr && sizeData) {
            const novoEstoqueTamanho = Math.max(0, Number(sizeData.estoque) - updateInfo.quantity);
            await supabaseAdmin
              .from("variant_sizes")
              .update({ estoque: novoEstoqueTamanho })
              .eq("id", updateInfo.sizeId);

            console.log(`[ESTOQUE] Tamanho ID ${updateInfo.sizeId} decrementado em ${updateInfo.quantity}. Novo estoque: ${novoEstoqueTamanho}`);
          }
        } else {
          const { data: prodData } = await supabaseAdmin
            .from("products")
            .select("estoque")
            .eq("id", updateInfo.productId)
            .single();

          if (prodData) {
            const novoEstoqueGeral = Math.max(0, Number(prodData.estoque) - updateInfo.quantity);
            await supabaseAdmin
              .from("products")
              .update({ estoque: novoEstoqueGeral })
              .eq("id", updateInfo.productId);

            console.log(`[ESTOQUE] Produto pai ${updateInfo.productId} decrementado em ${updateInfo.quantity}. Novo estoque: ${novoEstoqueGeral}`);
          }
        }
      }

      for (const productId of productIdsToRevalidate) {
        const { data: variantsList } = await supabaseAdmin
          .from("product_variants")
          .select(`
            id,
            variant_sizes (
              estoque
            )
          `)
          .eq("product_id", productId);

        if (variantsList && variantsList.length > 0) {
          let estoqueTotalCalculado = 0;
          for (const v of variantsList) {
            if (v.variant_sizes && Array.isArray(v.variant_sizes)) {
              for (const s of v.variant_sizes) {
                estoqueTotalCalculado += Number(s.estoque || 0);
              }
            }
          }

          await supabaseAdmin
            .from("products")
            .update({ estoque: estoqueTotalCalculado })
            .eq("id", productId);

          console.log(`[ESTOQUE] Estoque geral do produto ${productId} recalculado: ${estoqueTotalCalculado}`);
        }

        await revalidateProductFull(productId);
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