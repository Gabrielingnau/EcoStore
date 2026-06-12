import { supabaseBrowser } from "@/lib/supabase/client";
import { PlaceOrderPayload } from "../types/checkout-type";

export const checkoutService = {
  /**
   * Dispara a RPC para processar o checkout, deduzir estoque e criar o pedido.
   */
  placeOrder: async (payload: PlaceOrderPayload): Promise<string> => {
    // Tratamos os valores opcionais de 'undefined' para 'null' para satisfazer o Postgres
    const rpcArgs = {
      ...payload,
      _shipping_phone: payload._shipping_phone ?? null,
      _shipping_email: payload._shipping_email ?? null,
    };

    // Usamos o cast como any para evitar incompatibilidades nas chaves complexas do JSONB
    const { data, error } = await supabaseBrowser().rpc<"place_order">(
      "place_order",
      rpcArgs as any
    );

    if (error) throw error;
    if (!data) throw new Error("Não foi possível obter o ID do pedido.");

    return data;
  },
};