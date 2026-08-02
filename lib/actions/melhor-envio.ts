"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function enviarParaCarrinhoMelhorEnvio(data: any) {
  const supabase = supabaseAdmin;

  console.log("Iniciando integração com Melhor Envio...");

  const [{ data: integration }, { data: store }] = await Promise.all([
    supabase.from("integrations").select("access_token").single(),
    supabase.from("store_config").select("*").single(),
  ]);

  if (!integration?.access_token || !store) {
    console.error("Erro de configuração:", { integration, store });
    throw new Error("Configurações da loja ou integração ausentes.");
  }

  // Correção: Usa o peso real dos itens sem adicionar valores fixos inventados
  const totalWeight = data.items.reduce(
    (acc: number, i: any) => acc + (Number(i.item_weight) || 0) * i.quantity,
    0,
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
    // Correção: Usa estritamente as dimensões reais cadastradas no produto
    volumes: [
      {
        height: Number(data.items[0]?.item_height) || 10,
        width: Number(data.items[0]?.item_width) || 10,
        length: Number(data.items[0]?.item_length) || 10,
        weight: totalWeight > 0 ? totalWeight : 0.1,
      },
    ],
    options: {
      insurance_value: totalValue,
      receipt: false, // Alterado para false para evitar o custo extra indesejado de A.R.
      own_hand: false,
      collect: false,
      tags: [`ORDER-${data.orderId}`],
      platform: store.name,
    },
  };

  console.log("Payload enviado para Melhor Envio:", JSON.stringify(payload, null, 2));

  const response = await fetch(
    `${process.env.MELHOR_ENVIO_URL}/api/v2/me/cart`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${integration.access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": `${store.name} (${store.email})`,
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("=== FALHA NA INTEGRAÇÃO MELHOR ENVIO ===");
    console.error("Status da Resposta:", response.status);
    console.error("Detalhes do Erro:", JSON.stringify(result, null, 2));
    
    throw new Error(
      result.message || "Falha na integração com Melhor Envio"
    );
  }

  // ATUALIZAÇÃO CRÍTICA: Salvando o protocol para garantir a vinculação no Webhook
  const { error: updateError } = await supabase
    .from("orders")
    .update({ 
      melhor_envio_protocol: result.protocol 
    })
    .eq("id", data.orderId);

  if (updateError) {
    console.error("Erro ao salvar protocolo no Supabase:", updateError);
  }

  console.log("Sucesso! Protocolo salvo e pedido enviado:", result.protocol);
  return result;
}