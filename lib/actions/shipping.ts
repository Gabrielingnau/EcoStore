"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function getShippingRates(originZip: string, destinationZip: string, items: any[]) {
  const supabase = await supabaseServer();

  console.log("--- INÍCIO DO CÁLCULO DE FRETE ---");
  console.log("Parâmetros recebidos:", { originZip, destinationZip, totalItems: items.length });

  const { data: integration, error } = await supabase
    .from("integrations")
    .select("access_token")
    .single();

  if (error || !integration?.access_token) {
    console.error("Erro ao buscar token de integração:", error);
    throw new Error("Configuração de frete não encontrada.");
  }
  
  // Log parcial do token para segurança (não mostre o token completo em logs de produção!)
  console.log("Token encontrado, prefixo:", integration.access_token.substring(0, 10) + "...");

  // Prepara o payload para inspecionar os dados dos produtos
  const productsPayload = items.map(i => ({
    id: i.product.id,
    nome: i.product.nome, // Adicionei o nome para facilitar a identificação no log
    width: i.product.width || 10,
    height: i.product.height || 10,
    length: i.product.length || 10,
    weight: i.product.weight || 0.1,
    insurance_value: i.product.preco || 0,
    quantity: i.quantity
  }));

  console.log("Payload de produtos enviado ao Melhor Envio:", JSON.stringify(productsPayload, null, 2));

  const response = await fetch("https://melhorenvio.com.br/api/v2/me/shipment/calculate", {
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
      products: productsPayload,
      options: {
        receipt: true,
        own_hand: false
      },
      services: "1,2,18"
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erro retornado pelo Melhor Envio:", JSON.stringify(errorData, null, 2));
    throw new Error("Falha ao calcular frete com a transportadora.");
  }

  const result = await response.json();
  console.log("Sucesso! Resposta do Melhor Envio recebida.");
  return result;
}