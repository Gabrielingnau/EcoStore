import Link from "next/link";
import { ProductCard } from "@/components/site/product-card";
import { FeaturedCarousel } from "@/components/site/featured-carousel";
import { getHomeContent } from "./hooks/use-home-data";

export async function HomePage() {
  const { products: rawProducts, featured: rawFeatured, currentYear } = await getHomeContent();

  const products = rawProducts.map((p) => ({
    ...p,
    permite_retirada: Boolean(p.permite_retirada),
  }));

  const featured = rawFeatured.map((p) => ({
    ...p,
    permite_retirada: Boolean(p.permite_retirada),
  }));

  return (
    <div className="md:space-y-24 space-y-12">
      {/* Hero Section - Mais compacto e ajustado para o celular */}
      <section className="relative rounded-2xl md:rounded-[2rem] overflow-hidden bg-primary p-6 sm:p-8 md:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          {/* Badge Acessível com Vidro/Contraste */}
          <div className="inline-block bg-black/40 backdrop-blur-md px-3 py-0.5 md:px-3.5 md:py-1 rounded-full border border-white/10 mb-2 shadow-xs">
            <p className="text-[10px] md:text-xs uppercase tracking-widest text-white font-extrabold">
              Coleção {currentYear}
            </p>
          </div>

          {/* H1 menor no mobile e levemente reduzido no desktop */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mt-1 leading-tight text-primary-foreground drop-shadow-xs">
            Moda que acende seu estilo
          </h1>

          {/* Botão com proporção ideal no mobile */}
          <Link 
            href="#produtos" 
            className="inline-flex mt-5 md:mt-8 h-10 md:h-12 items-center px-5 md:px-7 rounded-lg md:rounded-xl bg-background text-foreground text-xs md:text-sm font-bold hover:scale-105 transition-smooth shadow-md"
          >
            Explorar coleção
          </Link>
        </div>
        
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-primary-glow/20 blur-[80px] md:blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Seção de Destaques com Carrossel */}
      {featured.length > 0 && (
        <section className="space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Destaques</h2>
            <div className="h-px flex-1 mx-8 bg-border/60 hidden md:block" />
          </div>
          <FeaturedCarousel products={featured} />
        </section>
      )}

      {/* Grid de Todos os Produtos */}
      <section id="produtos" className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Todos os produtos</h2>
        </div>
        
        {products.length === 0 ? (
          <div className="py-16 md:py-20 text-center border border-dashed rounded-2xl md:rounded-3xl">
            <p className="text-muted-foreground text-sm">Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((p, i) => (
              <ProductCard key={i} product={p} index={i}/>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}