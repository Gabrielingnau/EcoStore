"use server";

import { stripe } from "@/lib/stripe/server";

export async function createCheckoutSession(payload: any) {
  console.log("Dados recebidos no Checkout:", JSON.stringify(payload, null, 2));

  // 1. Identificação precisa do tipo de entrega
  const isPickup = payload.shipping.id === "pickup";
  const isLocalDelivery = payload.shipping.id === "local";
  const isBetterShipping = !isPickup && !isLocalDelivery;

  // 2. Definição de Status e Type baseados na escolha
  let status = "aguarde";
  let shippingType = "melhor_envio";

  if (isPickup) {
    status = "pronto para retirada";
    shippingType = "retirada";
  } else if (isLocalDelivery) {
    status = "preparando entrega";
    shippingType = "entrega_propria";
  }

  // Função auxiliar para calcular o preço efetivo (considerando o preço promocional)
  const getEffectivePrice = (product: any) => {
    const regularPrice = Number(product.preco) || 0;
    const promoPrice = product.preco_promocional ? Number(product.preco_promocional) : 0;
    return promoPrice > 0 && promoPrice < regularPrice ? promoPrice : regularPrice;
  };

  // Cálculos de total, peso e data considerando o preço promocional
  const totalItens = payload.items.reduce((acc: number, i: any) => {
    const price = getEffectivePrice(i.product);
    return acc + price * i.quantity;
  }, 0);
  
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

  const shippingName = isBetterShipping
    ? payload.shipping.company.name
    : payload.shipping.name;

  console.log("Calculado total do checkout:", total, "Peso total:", calculatedWeight);

  // 3. Formato enxuto dos itens incluindo o ID da variante e do tamanho
  const minimalItemsData = payload.items.map((i: any) => ({
    id: i.product.id,
    q: i.quantity,
    p: getEffectivePrice(i.product),
    v: i.product.variant_id || i.product.v || null,
    sz: i.product.variant_size_id || i.product.sz || null,
  }));

  // Montando o metadata base
  const metadata: Record<string, string> = {
    userId: payload.user.id || "",
    total: total.toString(),
    status: status,
    shippingType: shippingType,
    calculatedWeight: calculatedWeight.toString(),
    calculatedDeliveryDate: calculatedDeliveryDate.toISOString(),
    userData: JSON.stringify(payload.user),
    shippingData: JSON.stringify({
      id: payload.shipping.id,
      name: payload.shipping.name,
      price: payload.shipping.price,
      company: payload.shipping.company?.name || "",
      delivery_time: payload.shipping.delivery_time,
    }),
  };

  // Fatiamento dinâmico em blocos de até 3 itens por chave para nunca estourar 500 caracteres
  const chunkSize = 3;
  let chunkCount = 0;
  for (let i = 0; i < minimalItemsData.length; i += chunkSize) {
    chunkCount++;
    const chunk = minimalItemsData.slice(i, i + chunkSize);
    metadata[`itemsData_${chunkCount}`] = JSON.stringify(chunk);
  }
  metadata.itemsChunksCount = chunkCount.toString();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      ...payload.items.map((item: any) => {
        const effectivePrice = getEffectivePrice(item.product);
        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: item.product.nome,
              images: [item.product.imagem_url],
            },
            unit_amount: Math.round(effectivePrice * 100),
          },
          quantity: item.quantity,
        };
      }),
      {
        price_data: {
          currency: "brl",
          product_data: { name: `Frete: ${shippingName}` },
          unit_amount: Math.round(payload.shipping.price * 100),
        },
        quantity: 1,
      },
    ],
    metadata,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  console.log("Sessão Stripe criada com sucesso ID:", session.id);

  return { url: session.url };
}