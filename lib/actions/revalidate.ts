"use server";

import { revalidateTag, revalidatePath } from "next/cache";

/**
 * 1. Invalida a listagem geral (vitrine)
 */
export async function revalidateProductsList() {
  revalidateTag("products");
}

/**
 * 2. Invalida os detalhes de um produto específico por tag e por path
 */
export async function revalidateProductById(productId: string) {
  revalidateTag(`product-${productId}`);
  revalidatePath(`/produto/${productId}`);
}

/**
 * 3. Invalida as imagens de um produto específico
 */
export async function revalidateProductImages(productId: string) {
  revalidateTag(`product-images-${productId}`);
}

/**
 * 4. Invalida as variantes e tamanhos de um produto específico
 */
export async function revalidateProductVariants(productId: string) {
  revalidateTag(`product-variants-${productId}`);
}

/**
 * 5. Invalida as avaliações de um produto específico (caso necessário)
 */
export async function revalidateProductReviews(productId: string) {
  revalidateTag(`reviews-${productId}`);
}

/**
 * Executa todas as invalidações de uma vez só ao salvar o produto
 */
export async function revalidateProductFull(productId: string) {
  await Promise.all([
    revalidateProductsList(),
    revalidateProductById(productId),
    revalidateProductImages(productId),
    revalidateProductVariants(productId),
    revalidateProductReviews(productId),
  ]);
}