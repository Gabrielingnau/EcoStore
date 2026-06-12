import { unstable_cache } from "next/cache";

import { supabasePublic } from "@/lib/supabase/public";

import type { Database } from "@/types/database";

export type Review =
  Database["public"]["Tables"]["reviews"]["Row"];

export async function getProductReviews(
  productId: string
) {
  return unstable_cache(
    async (): Promise<Review[]> => {
      const supabase = supabasePublic;

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw new Error(
          "Erro ao carregar avaliações: " +
            error.message
        );
      }

      return (data ?? []) as Review[];
    },
    [`reviews-${productId}`],
    {
      tags: [`reviews-${productId}`],
    }
  )();
}