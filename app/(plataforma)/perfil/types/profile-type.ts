import type { Database } from "@/types/database";

// Define a estrutura exata do relacionamento entre pedidos e itens buscados
export type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

export interface OrderWithItems extends OrderRow {
  order_items: OrderItemRow[];
}