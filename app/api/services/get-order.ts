import { supabaseServer } from "@/lib/supabase/server";
import type { Order } from "../types/success-type";

export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const supabase = await supabaseServer();
    
    const { data, error } = await supabase
      .from("orders")
      .select("total")
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Erro ao buscar pedido:", error.message);
      return null;
    }

    return data as Order;
  } catch (err) {
    console.error("Erro inesperado na service getOrder:", err);
    return null;
  }
}