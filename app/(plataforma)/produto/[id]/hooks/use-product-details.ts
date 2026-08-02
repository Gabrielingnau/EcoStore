import { getProductById, getProductImages, getProductVariants } from "../services/get-product";
import { getProductReviews } from "../services/get-product-reviews";

export async function getProductDetails(id: string) {
  try {
    const product = await getProductById(id);
    if (!product) return null;

    const [extraImages, variants, reviews] = await Promise.all([
      getProductImages(id),
      getProductVariants(id),
      getProductReviews(id),
    ]);

    // Coleta imagens extras da tabela product_images e também imagens vindas do JSONB de product_variants (campo 'imagens')
    const extraUrls = extraImages.map((i) => i.url);
    const variantImages = variants.flatMap((v) => (Array.isArray(v.imagens) ? (v.imagens as string[]) : []));

    const images = Array.from(
      new Set([
        product.imagem_url,
        ...extraUrls,
        ...variantImages,
      ])
    ).filter(Boolean);

    return { product, images, variants, reviews };
  } catch (error) {
    console.error("Erro no getProductDetails:", error);
    return null;
  }
}