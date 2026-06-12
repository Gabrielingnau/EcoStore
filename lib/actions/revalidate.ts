"use server";

import { revalidateTag } from "next/cache";

/**
 * 1. Invalida a listagem geral (vitrine)
 */
export async function revalidateProductsList() {
  revalidateTag("products", 'max');
}

/**
 * 2. Invalida os detalhes de um produto específico
 */
export async function revalidateProductById(productId: string) {
  revalidateTag(`product-${productId}`, 'max');
}

/**
 * 3. Invalida as imagens de um produto específico
 */
export async function revalidateProductImages(productId: string) {
  revalidateTag(`product-images-${productId}`, 'max');
}

export async function revalidateProductFull(productId: string) {
  await Promise.all([
    revalidateProductsList(),
    revalidateProductById(productId),
    revalidateProductImages(productId)
  ]);
}