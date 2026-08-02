"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import type { ReviewInsert } from "../types/review-type";

export async function upsertReview(data: ReviewInsert) {
  const supabase = await supabaseServer();

  // O upsert respeita o unique constraint (product_id, user_id)
  const { error } = await supabase
    .from("reviews")
    .upsert(data, { onConflict: "product_id,user_id" });

  if (error) throw new Error(error.message);

  // Invalida a tag específica dos reviews e do produto, e limpa o path da página
  revalidateTag(`reviews-${data.product_id}`);
  revalidateTag(`product-${data.product_id}`);
  revalidatePath(`/produto/${data.product_id}`);
}

export async function deleteReview(id: string, product_id: string) {
  const supabase = await supabaseServer();
  
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Invalida a tag específica dos reviews e do produto, e limpa o path da página
  revalidateTag(`reviews-${product_id}`);
  revalidateTag(`product-${product_id}`);
  revalidatePath(`/produto/${product_id}`);
}