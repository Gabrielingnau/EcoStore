"use client";

import { ProductPurchaseBox } from "@/components/site/product-purchase-box";
import { ProductReviews } from "@/components/site/product-reviews";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export function ProductMainLayout({
  product,
  variants,
  reviews,
}: {
  product: any;
  variants: any[];
  reviews: any[];
}) {
  const principalVariant = variants.find((v) => v.is_principal) || variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    principalVariant?.id || null,
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  console.log("ProductMainLayout product:", product); // Adicione este log para depuração
  const currentVariant =
    variants.find((v) => v.id === selectedVariantId) || principalVariant;

  // Imagens exclusivas da variante selecionada (ou fallback para a imagem principal do produto)
  const currentImages = useMemo(() => {
    const variantImgs = Array.isArray(currentVariant?.imagens)
      ? (currentVariant.imagens as string[])
      : [];
    if (variantImgs.length > 0) return variantImgs;
    return [product.imagem_url].filter(Boolean);
  }, [currentVariant, product.imagem_url]);

  // Características consolidadas
  const coresDisponiveis = Array.from(
    new Set(variants.map((v: any) => v.cor).filter(Boolean)),
  ).join(", ");
  const estampasDisponiveis = Array.from(
    new Set(variants.map((v: any) => v.padrao_tecido).filter(Boolean)),
  ).join(", ");
  const tamanhosDisponiveis = Array.from(
    new Set(
      variants
        .flatMap((v: any) => (v.variant_sizes || []).map((s: any) => s.tamanho))
        .filter(Boolean),
    ),
  ).join(", ");

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 mt-4">
      
      {/* 1. CARROSSEL (1º no Mobile | Coluna da Esquerda no Desktop) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
          {/* Miniaturas */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[450px] order-2 sm:order-1 scrollbar-thin">
            {currentImages.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-muted",
                  activeImageIndex === idx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/60 hover:border-border opacity-70 hover:opacity-100",
                )}
              >
                <img
                  src={img}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Imagem Principal */}
          <div className="relative flex-1 rounded-xl overflow-hidden bg-muted flex items-center justify-center min-h-[380px] sm:min-h-[425px] order-1 sm:order-2">
            {currentImages[activeImageIndex] ? (
              <img
                src={currentImages[activeImageIndex]}
                alt={product.nome}
                className="w-full h-full object-contain max-h-[425px] transition-all duration-300"
              />
            ) : (
              <span className="text-xs text-muted-foreground">Sem imagem</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. BUY BOX / FORMA DE PAGAMENTO (2º no Mobile | Coluna da Direita no Desktop) */}
      <div className="lg:col-span-4 lg:row-span-3 flex flex-col gap-6">
        <ProductPurchaseBox
          product={product}
          variants={variants}
          selectedVariantId={selectedVariantId}
          onSelectVariant={(id) => {
            setSelectedVariantId(id);
            setActiveImageIndex(0);
          }}
        />
      </div>

      {/* 3. CARACTERÍSTICAS (3º no Mobile | Abaixo do Carrossel no Desktop) */}
      <div className="lg:col-span-8 bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Características do produto
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {product.marca && (
            <div className="flex justify-between py-2 border-b border-border/45">
              <span className="text-muted-foreground">Marca</span>
              <span className="font-medium text-foreground">
                {product.marca}
              </span>
            </div>
          )}
          {product.modelo && (
            <div className="flex justify-between py-2 border-b border-border/45">
              <span className="text-muted-foreground">Modelo</span>
              <span className="font-medium text-foreground">
                {product.modelo}
              </span>
            </div>
          )}
          {product.condicao && (
            <div className="flex justify-between py-2 border-b border-border/45">
              <span className="text-muted-foreground">Condição</span>
              <span className="font-medium text-foreground capitalize">
                {product.condicao}
              </span>
            </div>
          )}
          {product.categoria && (
            <div className="flex justify-between py-2 border-b border-border/45">
              <span className="text-muted-foreground">Categoria</span>
              <span className="font-medium text-foreground">
                {product.categoria}
              </span>
            </div>
          )}
          {coresDisponiveis && (
            <div className="flex justify-between py-2 border-b border-border/45">
              <span className="text-muted-foreground">Cores disponíveis</span>
              <span className="font-medium text-foreground capitalize">
                {coresDisponiveis}
              </span>
            </div>
          )}
          {estampasDisponiveis && (
            <div className="flex justify-between py-2 border-b border-border/45">
              <span className="text-muted-foreground">Estampas</span>
              <span className="font-medium text-foreground capitalize">
                {estampasDisponiveis}
              </span>
            </div>
          )}
          {tamanhosDisponiveis && (
            <div className="flex justify-between py-2 border-b border-border/45">
              <span className="text-muted-foreground">Tamanhos</span>
              <span className="font-medium text-foreground">
                {tamanhosDisponiveis}
              </span>
            </div>
          )}
          {product.peso !== null && product.peso !== undefined && (
            <div className="flex justify-between py-2 border-b border-border/45">
              <span className="text-muted-foreground">Peso</span>
              <span className="font-medium text-foreground">
                {product.peso} kg
              </span>
            </div>
          )}
          {product.garantia_dias !== null && product.garantia_dias > 0 && (
            <div className="flex justify-between py-2 border-b border-border/45">
              <span className="text-muted-foreground">Garantia</span>
              <span className="font-medium text-foreground">
                {product.garantia_dias} dias (
                {product.garantia_tipo || "vendedor"})
              </span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-border/45">
            <span className="text-muted-foreground">Retirada no local</span>
            <span className="font-medium text-foreground">
              {product.permite_retirada ? "Disponível" : "Indisponível"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. DESCRIÇÃO E AVALIAÇÕES (4º e 5º no Mobile | Sequência da Esquerda no Desktop) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">Descrição</h2>
          <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
            {product.descricao}
          </p>
        </div>

        <div className="pt-4 border-t border-border/60">
          <h2 className="text-xl font-bold mb-6 tracking-tight text-foreground">
            Opiniões do produto
          </h2>
          <ProductReviews productId={product.id} initialReviews={reviews} />
        </div>
      </div>

    </div>
  );
}