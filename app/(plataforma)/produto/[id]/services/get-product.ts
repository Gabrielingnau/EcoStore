import { unstable_cache } from "next/cache";

import { supabasePublic } from "@/lib/supabase/public";
import { ProductDatabase, ProductImagesDatabase } from "../types/product-type";

export async function getProductById(id: string) {
  return unstable_cache(
    async (): Promise<ProductDatabase | null> => {
      const supabase = supabasePublic;

      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw new Error(
          "Erro ao buscar produto: " + error.message
        );
      }

      return product as ProductDatabase | null;
    },
    [`product-${id}`],
    {
      tags: [
        `product-${id}`,
      ],
    }
  )();
}

export async function getProductImages(
  productId: string
) {
  return unstable_cache(
    async (): Promise<ProductImagesDatabase> => {
      const supabase = supabasePublic;

      const { data: imgs, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("position", {
          ascending: true,
        });

      if (error) {
        throw new Error(
          "Erro ao buscar imagens: " + error.message
        );
      }

      return (imgs ?? []) as ProductImagesDatabase;
    },
    [`product-images-${productId}`],
    {
      tags: [
        `product-images-${productId}`,
      ],
    }
  )();
}