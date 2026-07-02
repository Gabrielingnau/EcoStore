"use server";

import { stripe } from "@/lib/stripe/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function createCheckoutSession(payload: any) {
  const supabase = await supabaseServer();

  console.log("Dados recebidos no Checkout:", JSON.stringify(payload, null, 2));

  // 1. Identificação precisa do tipo de entrega
  const isPickup = payload.shipping.id === "pickup";
  const isLocalDelivery = payload.shipping.id === "local";
  const isBetterShipping = !isPickup && !isLocalDelivery;

  // 2. Definição de Status e Type baseados na escolha
  let status = "pendente";
  let shippingType = "melhor_envio";

  if (isPickup) {
    status = "pronto para retirada"; // Status específico para retirada
    shippingType = "retirada";
  } else if (isLocalDelivery) {
    status = "preparando entrega"; // Status específico para entrega própria
    shippingType = "entrega_propria";
  }

  // Cálculos de total, peso e data
  const totalItens = payload.items.reduce(
    (acc: number, i: any) => acc + i.product.preco * i.quantity,
    0,
  );
  const total = totalItens + Number(payload.shipping.price);

  const calculatedWeight =
    isPickup || isLocalDelivery
      ? payload.items.reduce(
          (acc: number, i: any) => acc + Number(i.product.weight || 0),
          0,
        )
      : payload.shipping.packages.reduce(
          (acc: number, p: any) => acc + Number(p.weight || 0),
          0,
        );

  const days =
    isPickup || isLocalDelivery
      ? 1
      : Number(payload.shipping.delivery_time) || 0;
  const calculatedDeliveryDate = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  );

  // 3. Salvando o pedido
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: payload.user.id,
      total: total,
      status: status, // "pronto para retirada", "preparando entrega" ou "pendente"
      shipping_type: shippingType, // "retirada", "entrega própria" ou "melhor envio"
      tracking_code:
        isPickup || isLocalDelivery
          ? "Não rastreável"
          : payload.shipping.tracking_code || null,
      shipping_name: payload.user.name,
      shipping_address: payload.user.address,
      shipping_city: payload.user.city,
      shipping_state: payload.user.state,
      shipping_zip: payload.user.zip,
      shipping_phone: payload.user.phone,
      shipping_email: payload.user.email,
      shipping_document: payload.user.document,
      shipping_cost: Number(payload.shipping.price),
      shipping_service_id: String(payload.shipping.id),
      shipping_company_name: isBetterShipping
        ? payload.shipping.company.name
        : payload.shipping.name,
      total_weight: calculatedWeight,
      estimated_delivery: calculatedDeliveryDate.toISOString(),
    })
    .select("id")
    .single();

  if (orderError) {
    console.error("Erro ao salvar pedido no Supabase:", orderError);
    throw new Error("Erro ao criar pedido: " + orderError.message);
  }

  // Salva itens
  const itemsToInsert = payload.items.map((i: any) => ({
    order_id: order.id,
    product_id: i.product.id,
    product_name: i.product.nome,
    product_image: i.product.imagem_url,
    unit_price: i.product.preco,
    quantity: i.quantity,
    item_weight: i.product.weight || 0,
    item_width: i.product.width || 0,
    item_height: i.product.height || 0,
    item_length: i.product.length || 0,
  }));

  await supabase.from("order_items").insert(itemsToInsert);

  // 4. Criação no Stripe
  const shippingName = isBetterShipping
    ? payload.shipping.company.name
    : payload.shipping.name;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      ...payload.items.map((item: any) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.product.nome,
            images: [item.product.imagem_url],
          },
          unit_amount: Math.round(item.product.preco * 100),
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: "brl",
          product_data: { name: `Frete: ${shippingName}` },
          unit_amount: Math.round(payload.shipping.price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: order.id },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/sucesso/${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  return { url: session.url };
}
