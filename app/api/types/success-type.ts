import type { Database } from "@/types/database";

// Extrai o tipo exato da Row de orders do seu Supabase
export type Order = Database["public"]["Tables"]["orders"]["Row"];

export interface SuccessPageProps {
  params: Promise<{ orderId: string }>;
}