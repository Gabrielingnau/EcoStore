import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { enviarParaCarrinhoMelhorEnvio } from "@/lib/actions/melhor-envio";
import { revalidateProductById } from "@/lib/actions/revalidate";

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
    const orderId = session.metadata.orderId;

    try {
      // 1. Atualizar status do pagamento para Pago
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({ payment_status: "Pago" }) 
        .eq("id", orderId);

      if (updateError) throw new Error("Falha ao atualizar pagamento");

      // 2. Buscar dados do pedido
      const { data: order, error: fetchError } = await supabaseAdmin
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single();

      if (fetchError || !order) throw new Error("Pedido não encontrado");

      // 3. ATUALIZAÇÃO DE ESTOQUE (Feito manualmente no código)
      for (const item of order.order_items) {
        if (item.product_id) {
          // Busca o estoque atual do produto
          const { data: product, error: prodError } = await supabaseAdmin
            .from("products")
            .select("estoque")
            .eq("id", item.product_id)
            .single();

          if (!prodError && product) {
            // Calcula o novo estoque (evita números negativos)
            const novoEstoque = Math.max(0, product.estoque - item.quantity);

            // Atualiza no banco
            await supabaseAdmin
              .from("products")
              .update({ estoque: novoEstoque })
              .eq("id", item.product_id);
            revalidateProductById(item.product_id); // Revalida a página do produto para refletir o novo estoque
            console.log(`Estoque do produto ${item.product_id} atualizado para ${novoEstoque}`);
          }
        }
      }

      // 4. LÓGICA DE INTEGRAÇÃO CONDICIONAL
      // Agora usamos o shipping_type para saber como proceder
      if (order.shipping_type === 'retirada' || order.shipping_type === 'entrega_propria') {
        console.log(`[WEBHOOK STRIPE] Pedido ${orderId} local. Nenhuma ação externa necessária.`);
        // O status já foi definido como "pronto_para_retirada" ou "preparando_entrega" no Checkout, 
        // então não vamos sobrescrevê-lo aqui!
      } else {
        // Integração normal com Melhor Envio para pedidos de transportadora
        console.log(`[WEBHOOK STRIPE] Iniciando integração com Melhor Envio...`);
        try {
          await enviarParaCarrinhoMelhorEnvio({
            shipping: {
              id: order.shipping_service_id, 
              name: order.shipping_name,
              address: order.shipping_address,
              city: order.shipping_city,
              zip: order.shipping_zip,
              phone: order.shipping_phone,
              email: order.shipping_email,
              document: order.shipping_document
            },
            items: order.order_items,
            orderId: order.id
          });
          
          // Se deu certo, atualiza para "Etiqueta Gerada"
          await supabaseAdmin
            .from("orders")
            .update({ status: "Etiqueta Gerada" })
            .eq("id", orderId);
            
        } catch (integrationError) {
          console.error("❌ Falha na integração:", integrationError);
          await supabaseAdmin
            .from("orders")
            .update({ status: "Erro de Integração" })
            .eq("id", orderId);
        }
      }
      
    } catch (error) {
      console.error("[WEBHOOK STRIPE] Erro interno:", error);
      return new NextResponse("Erro processando pedido", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}