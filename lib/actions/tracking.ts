"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function syncOrderTracking(orderId: string, trackingCode: string) {
  const supabase = await supabaseServer();

  console.log(`[DEBUG] Iniciando syncOrderTracking para Pedido: ${orderId} | Código: ${trackingCode}`);

  const { data: integration, error: intError } = await supabase
    .from("integrations")
    .select("access_token")
    .single();

  if (intError || !integration?.access_token) {
    console.error("[ERRO] Falha ao buscar token de integração:", intError);
    throw new Error("Token de integração não encontrado.");
  }

  // URL correta conforme documentação oficial: /me/shipment/tracking/{tracking}
  // Use esta URL agora que você tem a permissão
// A URL deve ser apenas o endpoint, sem o ?tracking=...
  const url = `https://sandbox.melhorenvio.com.br/api/v2/me/shipment/tracking`;

  // O corpo continua correto enviando o array 'orders'
  const response = await fetch(url, {
    method: "POST", 
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${integration.access_token}`,
      "Content-Type": "application/json",
      "User-Agent": "MinhaLoja (contato@exemplo.com)",
    },
    body: JSON.stringify({
      orders: [trackingCode] 
    }),
  });

  const responseText = await response.text();

  console.log(`[DEBUG] Status da Resposta: ${response.status}`);
  console.log(`[DEBUG] Corpo da Resposta Bruta: ${responseText}`);

  if (!response.ok) {
    console.error(`[ERRO] API Melhor Envio retornou erro ${response.status}:`, responseText);

    if (response.status === 404) {
      return { success: false, lastEvent: "Rastreio não encontrado na API" };
    }

    throw new Error(`Erro na API do Melhor Envio: ${response.status}`);
  }

  const result = JSON.parse(responseText);
  
  // Extração inteligente do último evento do histórico conforme a documentação
  // A API retorna um array 'history'. O último item é o status mais recente.
  const lastEvent = (result.history && result.history.length > 0)
    ? result.history[result.history.length - 1].description
    : (result.status || "Aguardando movimentação");

  console.log(`[DEBUG] Evento extraído: ${lastEvent}`);

  const { error: dbError } = await supabase
    .from("orders")
    .update({ last_tracking_event: lastEvent })
    .eq("id", orderId);

  if (dbError) {
    console.error("[ERRO] Falha ao atualizar banco de dados:", dbError);
    throw new Error("Erro ao atualizar o pedido no banco.");
  }

  console.log(`[DEBUG] Banco de dados atualizado com sucesso para: ${lastEvent}`);
  return { success: true, lastEvent };
}