"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function enviarParaCarrinhoMelhorEnvio(data: any) {
  const supabase = await supabaseServer();

  console.log("Iniciando integração com Melhor Envio...");

  const [{ data: integration }, { data: store }] = await Promise.all([
    supabase.from("integrations").select("access_token").single(),
    supabase.from("store_config").select("*").single(),
  ]);

  if (!integration?.access_token || !store) {
    console.error("Erro de configuração:", { integration, store });
    throw new Error("Configurações da loja ou integração ausentes.");
  }

  const totalWeight = data.items.reduce(
    (acc: number, i: any) => acc + (Number(i.item_weight) || 0.3) * i.quantity,
    0.1,
  );
  const totalValue = data.items.reduce(
    (acc: number, i: any) => acc + (Number(i.unit_price) || 0) * i.quantity,
    0,
  );

  const payload = {
    service: Number(data.shipping.id),
    from: {
      name: store.name,
      phone: store.phone,
      email: store.email,
      address: store.address,
      city: store.city,
      state: store.state,
      postal_code: store.zip_code,
    },
    to: {
      name: data.shipping.name,
      phone: data.shipping.phone,
      email: data.shipping.email,
      address: data.shipping.address,
      city: data.shipping.city,
      state: data.shipping.state,
      postal_code: data.shipping.zip,
      document: data.shipping.document,
    },
    products: data.items.map((i: any) => ({
      name: i.product_name,
      quantity: Number(i.quantity),
      unitary_value: Number(i.unit_price),
    })),
    volumes: [
      {
        height: Number(data.items[0]?.item_height || 10),
        width: Number(data.items[0]?.item_width || 10),
        length: Number(data.items[0]?.item_length || 10),
        weight: totalWeight,
      },
    ],
    options: {
      insurance_value: totalValue,
      receipt: false,
      own_hand: false,
      collect: false,
    },
  };

  // Log do payload enviado
  console.log("Payload enviado para Melhor Envio:", JSON.stringify(payload, null, 2));

  const response = await fetch(
    "https://sandbox.melhorenvio.com.br/api/v2/me/cart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${integration.access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "MinhaLoja (contato@exemplo.com)",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    // Log detalhado para identificar o erro específico do Melhor Envio
    console.error("=== FALHA NA INTEGRAÇÃO MELHOR ENVIO ===");
    console.error("Status da Resposta:", response.status);
    console.error("Detalhes do Erro:", JSON.stringify(result, null, 2));
    console.error("==========================================");
    
    throw new Error(
      result.message || 
      result.errors ? JSON.stringify(result.errors) : "Falha na integração com Melhor Envio"
    );
  }

  await supabase
    .from("orders")
    .update({ status: "preparing" }) // Ou o status que você preferir
    .eq("id", data.orderId);

  console.log("Sucesso! Item adicionado ao carrinho do Melhor Envio.");
  return result;
}