"use server";
import { revalidateTag } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import type { ReviewInsert } from "../types/review-type";

export async function upsertReview(data: ReviewInsert) {
  const supabase = await supabaseServer();

  // O upsert é vital aqui para respeitar o unique constraint
  const { error } = await supabase
    .from("reviews")
    .upsert(data, { onConflict: "product_id,user_id" });

  if (error) throw new Error(error.message);

  revalidateTag(`reviews-${data.product_id}`);
  revalidateTag(`product-${data.product_id}`);
}

export async function deleteReview(id: string, product_id: string) {
  const supabase = await supabaseServer();
  await supabase.from("reviews").delete().eq("id", id);
  revalidateTag(`reviews-${product_id}`);
  revalidateTag(`product-${product_id}`);
}