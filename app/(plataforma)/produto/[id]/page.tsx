import { BackButton } from "@/components/site/back-button";
import { ProductMainLayout } from "@/components/site/product-main-layout"; // Componente cliente que criaremos/ajustaremos
import { notFound } from "next/navigation";
import { getProductDetails } from "./hooks/use-product-details";

export const revalidate = 30;

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const productId = params.id;

  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      productId,
    );
  if (!productId || productId === "undefined" || !isUUID) {
    return notFound();
  }

  const details = await getProductDetails(productId);
  if (!details) return notFound();

  const { product, variants, reviews } = details;
console.log("ProductPage details:", details); // Adicione este log para depuração
  return (
    <div className="mx-auto">
      <BackButton />

      {/* Componente que gerencia o estado compartilhado entre carrossel lateral e buy box */}
      <ProductMainLayout
        product={product}
        variants={variants}
        reviews={reviews}
      />
    </div>
  );
}
