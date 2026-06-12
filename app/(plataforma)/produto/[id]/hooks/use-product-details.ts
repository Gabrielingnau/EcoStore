import { getProductById, getProductImages } from "../services/get-product";
import { getProductReviews } from "../services/get-product-reviews";

export async function getProductDetails(id: string) {
  try {
    const product = await getProductById(id);

    if (!product) return null;

    const extraImages = await getProductImages(id);

    // Filtramos para não repetir a imagem principal no carrossel
    const extraUrls = extraImages.map((i) => i.url);
    const images = [
      product.imagem_url,
      ...extraUrls.filter((url) => url !== product.imagem_url),
    ];

    const reviews = await getProductReviews(id);

    return { product, images, reviews };
  } catch (error) {
    console.error("Erro no getProductDetails:", error);
    return null;
  }
}
