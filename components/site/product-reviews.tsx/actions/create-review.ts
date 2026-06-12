"use server";

import { revalidateTag } from "next/cache";

import { supabaseServer } from "@/lib/supabase/server";

import type { ReviewInsert } from "../types/review-type";

export async function createReview({
  product_id,
  user_id,
  rating,
  comment,
}: ReviewInsert) {
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from("reviews")
    .insert({
      product_id,
      user_id,
      rating,
      comment,
    });

  if (error) {
    throw new Error(error.message);
  }

  // Substitua as chamadas antigas por esta estrutura:
 revalidateTag(`reviews-${product_id}`, 'max');

  revalidateTag(`product-${product_id}`, 'max');
}