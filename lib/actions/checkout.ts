"use server";

import { stripe } from "@/lib/stripe/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function createCheckoutSession(payload: any) {
  const supabase = await supabaseServer();

  // Log para depuração dos dados que chegam
  console.log("Dados recebidos no Checkout:", JSON.stringify(payload, null, 2));

  // 1. Cálculo do total
  const totalItens = payload.items.reduce(
    (acc: number, i: any) => acc + i.product.preco * i.quantity,
    0,
  );
  const total = totalItens + Number(payload.shipping.price);

  // 2. Salva o pedido com status 'pendente' (Incluindo os novos campos)
  // Certifique-se de que o front-end está enviando payload.user.state e payload.user.document
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: payload.user.id,
      total: total,
      status: "pendente",
      shipping_name: payload.user.name,
      shipping_address: payload.user.address,
      shipping_city: payload.user.city,
      shipping_zip: payload.user.zip,
      shipping_phone: payload.user.phone,
      shipping_email: payload.user.email,
      shipping_cost: Number(payload.shipping.price),
      shipping_service_id: String(payload.shipping.id),
      shipping_company_name: payload.shipping.company.name,
      // NOVOS CAMPOS: Certifique-se que o banco tenha essas colunas
      shipping_document: payload.user.document,
      shipping_state: payload.user.state, 
    })
    .select("id")
    .single();

  if (orderError) {
    console.error("Erro ao salvar pedido no Supabase:", orderError);
    throw new Error("Erro ao criar pedido: " + orderError.message);
  }

  console.log("Pedido criado com sucesso. ID:", order.id);

  // 3. Salva itens
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
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      ...payload.items.map((item: any) => ({
        price_data: {
          currency: "brl",
          product_data: { 
            name: item.product.nome,
            images: [item.product.imagem_url]
          },
          unit_amount: Math.round(item.product.preco * 100),
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: "brl",
          product_data: { name: `Frete: ${payload.shipping.company.name}` },
          unit_amount: Math.round(payload.shipping.price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: order.id },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sucesso/${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
  });

  return { url: session.url };
}