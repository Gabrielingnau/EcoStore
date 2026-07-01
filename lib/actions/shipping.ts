"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function getShippingRates(originZip: string, destinationZip: string, items: any[]) {
  const supabase = await supabaseServer();

  // Como a tabela só tem uma linha, não precisamos de filtros (.eq, .match)
  // O .single() é suficiente para buscar o único registro existente.
  const { data: integration, error } = await supabase
    .from("integrations")
    .select("access_token")
    .single();

  if (error || !integration?.access_token) {
    console.error("Erro ao buscar token de integração:", error);
    throw new Error("Configuração de frete não encontrada.");
  }

  console.log("Calculando frete com Melhor Envio", { originZip, destinationZip });

  const response = await fetch(`${process.env.MELHOR_ENVIO_URL}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${integration.access_token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "EcoStore (gabrielingnau@gmail.com)"
    },
    body: JSON.stringify({
      from: { postal_code: originZip },
      to: { postal_code: destinationZip },
      products: items.map(i => ({
        id: i.product.id,
        width: i.product.width || 10,
        height: i.product.height || 10,
        length: i.product.length || 10,
        weight: i.product.weight || 0.1,
        insurance_value: i.product.preco || 0,
        quantity: i.quantity
      })),
      options: {
        receipt: true,
        own_hand: false
      },
      services: "1,2,18"
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erro Melhor Envio:", errorData);
    throw new Error("Falha ao calcular frete com a transportadora.");
  }

  return await response.json();
}