import { notFound } from "next/navigation";
import { ProductImageCarousel } from "@/components/site/product-image-carousel";
import { ProductReviews } from "@/components/site/product-reviews.tsx";
import { BackButton } from "@/components/site/back-button";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";
import { AddToCartButton } from "./add-to-cart-button";
import { getProductDetails } from "./hooks/use-product-details";
import { cn } from "@/lib/utils"; // 👈 Importante para gerenciar classes dinâmicas
import { BuyNowButton } from "./components/buy-now-button";

export const revalidate = 30;

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  // 1. Desembrulhar a Promise do params
  const params = await props.params; 
  const productId = params.id;

  // 2. Validação rigorosa de UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);

  if (!productId || productId === "undefined" || !isUUID) {
    return notFound();
  }

  // 3. Busca de dados via Hook/Service
  const details = await getProductDetails(productId);
  
  if (!details) return notFound();

  const { product, images, reviews } = details;

  // Variável auxiliar de validação de estoque
  const temEstoque = product.estoque > 0;

  return (
    <div>
      {/* Botão de navegação para retornar */}
      <BackButton />

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        
        {/* Lado Esquerdo: Carrossel de Imagens */}
        <div className="relative rounded-[var(--radius)] overflow-hidden">
          {/* 🔴 FILTRO VISUAL DE FORA DE ESTOQUE */}
          <div className={cn(
            "transition-all duration-300", 
            !temEstoque && "opacity-50 grayscale-[60%] blur-[0.5px]"
          )}>
            <ProductImageCarousel images={images} alt={product.nome} />
          </div>

          {/* Badge flutuante gigante caso o produto esteja esgotado */}
          {!temEstoque && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
              <span className="bg-destructive text-destructive-foreground px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-2xl border border-white/10 animate-fade-in">
                Produto Esgotado
              </span>
            </div>
          )}
        </div>

        {/* Lado Direito: Informações e Compra */}
        <div className="flex flex-col">
          <Badge className="self-start mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors uppercase tracking-widest text-[10px] font-bold">
            {product.categoria}
          </Badge>
          
          <h1 className={cn(
            "text-3xl md:text-5xl font-black leading-tight text-foreground tracking-tight line-clamp-2",
            !temEstoque && "text-muted-foreground" // Suaviza o título se estiver sem estoque
          )}>
            {product.nome}
          </h1>
          
          <p className={cn(
            "text-3xl md:text-4xl font-black text-primary mt-6 drop-shadow-sm",
            !temEstoque && "text-muted-foreground/60 line-through decoration-destructive/30" // Risca o preço sutilmente
          )}>
            {formatBRL(product.preco)}
          </p>
          
          <div className="h-px w-full bg-border/50 my-8" />
          
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-line">
            {product.descricao}
          </p>

          {/* Status de Estoque Inteligente */}
          <div className="mt-6 flex items-center gap-2 text-sm font-medium">
            <div className={cn(
              "h-2 w-2 rounded-full",
              temEstoque ? 'bg-green-500 animate-pulse' : 'bg-destructive'
            )} />
            <span className={cn(
              "font-semibold",
              temEstoque ? "text-muted-foreground" : "text-destructive"
            )}>
              {temEstoque 
                ? `${product.estoque} unidades disponíveis` 
                : "Produto indisponível no momento"}
            </span>
          </div>

          {/* Botão de Adicionar ao carrinho (que já deve possuir estado disabled interno) */}
          <div className="mt-10 flex flex-col gap-3">
            {/* Mantemos o de adicionar ao carrinho para quem quer continuar comprando */}
            <AddToCartButton product={product} />
            
            {/* O novo botão que redireciona direto */}
            <BuyNowButton product={product} />
          </div>
        </div>
      </div>

      {/* Seção de Experiência do Cliente */}
      <section className="mt-12 md:mt-20 border-t border-border/60 pt-16">
        <h2 className="text-2xl font-bold mb-10 tracking-tight text-foreground">
          Avaliações de quem comprou
        </h2>
        <ProductReviews productId={product.id} initialReviews={reviews} />
      </section>
    </div>
  );
}