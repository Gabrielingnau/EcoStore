import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { syncOrderTracking } from "@/lib/actions/tracking";

export async function GET(req: Request) {
  // Segurança básica: verificar se quem chamou é o próprio cron ou alguém autorizado
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = await supabaseServer();

  // Busca pedidos que estão 'shipped' (a caminho) e possuem tracking_code
  const { data: orders } = await supabase
    .from("orders")
    .select("id, tracking_code")
    .eq("status", "shipped")
    .not("tracking_code", "is", null);

  if (!orders) return NextResponse.json({ message: "Nenhum pedido para atualizar" });

  // Processa em lote (limitado para não estourar o tempo da lambda)
  const results = await Promise.allSettled(
    orders.map(order => syncOrderTracking(order.id, order.tracking_code!))
  );

  return NextResponse.json({ message: "Atualização concluída", results });
}