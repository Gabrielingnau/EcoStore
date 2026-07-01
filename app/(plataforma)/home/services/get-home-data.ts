import { unstable_cache } from "next/cache";

import { supabasePublic } from "@/lib/supabase/public";

import type { ProductDatabase } from "../types/product-type";

export const getAllProducts = unstable_cache(
  async (): Promise<ProductDatabase> => {
    const supabase = supabasePublic;

    const { data, error } = await supabase
      .from("products")
      .select(
        "*"
      )
      // 🔴 O FILTRO DA VITRINE: Garante que os clientes só vejam os produtos ativos
      .eq("ativo", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Erro ao carregar produtos: " + error.message);
    }

    return (data ?? []) as ProductDatabase;
  },
  ["products-list"],
  {
    tags: ["products"],
  },
);
