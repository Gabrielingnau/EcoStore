import { supabaseBrowser } from "@/lib/supabase/client";

import type { OrderWithItems } from "../types/profile-type";

export async function getUserOrders(userId: string): Promise<OrderWithItems[]> {
  const { data, error } = await supabaseBrowser()
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar pedidos:", error.message);
    throw error;
  }

  return (data ?? []) as unknown as OrderWithItems[];
}
