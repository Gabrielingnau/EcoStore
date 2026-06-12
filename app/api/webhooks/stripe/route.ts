import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { enviarParaCarrinhoMelhorEnvio } from "@/lib/actions/melhor-envio";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

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
      // 1. Marcar como 'pago' imediatamente (Garantia de que o dinheiro entrou)
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({ status: "pago" })
        .eq("id", orderId);

      if (updateError) throw new Error("Falha ao atualizar status para pago");

      // 2. Tentar integração com Melhor Envio
      // Buscamos o pedido com os itens
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single();

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
            document: order.shipping_document // Certifique-se que esse campo existe no seu BD
          },
          items: order.order_items,
          orderId: order.id
        });
      } catch (integrationError) {
        console.error("❌ Falha crítica na integração:", integrationError);
        // O pedido continua como 'pago', mas sinalizamos que algo deu errado
        await supabaseAdmin
          .from("orders")
          .update({ status: "integracao_pendente" })
          .eq("id", orderId);
      }
      
    } catch (error) {
      console.error("Erro interno no Webhook:", error);
      return new NextResponse("Erro processando pedido", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}