import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    console.log(
      "[WEBHOOK DEBUG] Payload recebido:",
      JSON.stringify(payload, null, 2),
    );

    const event = payload.event;
    const data = payload.data;

    if (!data) {
      console.error("[WEBHOOK DEBUG] Erro: campo 'data' ausente.");
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const supabase = await supabaseServer();
    let orderData: { id: string, user_id: string } | null = null;

    // 1. TENTATIVA VIA PROTOCOL (O identificador mais estável do Melhor Envio)
    if (data.protocol) {
      const { data: dbOrder } = await supabase
        .from("orders")
        .select("id, user_id")
        .eq("melhor_envio_protocol", data.protocol)
        .single();

      if (dbOrder) {
        orderData = dbOrder;
      }
    }

    // 2. FALLBACK VIA TAGS (Caso o protocolo falhe, verifica a lista de tags)
    if (!orderData && Array.isArray(data.tags)) {
      const found = data.tags.find(
        (item: any) =>
          item?.tag &&
          typeof item.tag === "string" &&
          item.tag.startsWith("ORDER-"),
      );

      if (found) {
        const id = found.tag.replace("ORDER-", "");
        const { data: dbOrder } = await supabase
          .from("orders")
          .select("id, user_id")
          .eq("id", id)
          .single();
        
        if (dbOrder) orderData = dbOrder;
      }
    }

    console.log(`[WEBHOOK DEBUG] Evento: ${event} | OrderData encontrado: ${JSON.stringify(orderData)}`);

    if (!orderData) {
      console.warn(
        "[WEBHOOK DEBUG] Aviso: Não foi possível identificar o pedido via Protocol ou Tag.",
      );
      return NextResponse.json({ message: "No match found" }, { status: 200 });
    }

    // Mapeamento de status
    const statusMapping: Record<string, string> = {
      "order.created": "Em Preparação",
      "order.pending": "Pendente (Carrinho)",
      "order.paid": "Etiqueta Paga",
      "order.ready-to-print": "Pronto para Envio",
      "order.printed": "Etiqueta Gerada",
      "order.posted": "A Caminho",
      "order.delivered": "Entregue",
      "order.canceled": "Cancelado",
    };

    const newStatus = statusMapping[event];

    // Preparar campos de atualização
    let updateFields: any = {
      last_tracking_event: `Evento: ${event} | Status: ${data.status || ""}`,
    };

    if (newStatus) {
      updateFields.status = newStatus;
    }

    if (data.tracking) {
      updateFields.tracking_code = data.tracking;
    }

    // Execução da atualização no Supabase
    const { error: updateError } = await supabase
      .from("orders")
      .update(updateFields)
      .eq("id", orderData.id);

    if (updateError) {
      console.error("[WEBHOOK DEBUG] Erro ao atualizar Supabase:", updateError);
      return NextResponse.json({ error: "DB Update Error" }, { status: 500 });
    }

    console.log(
      `[WEBHOOK DEBUG] Sucesso! Pedido ${orderData.id} atualizado via ${event}.`,
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WEBHOOK DEBUG] Erro catastrófico:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}