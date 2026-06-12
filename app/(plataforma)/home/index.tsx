import Link from "next/link";
import { ProductCard } from "@/components/site/product-card";
import { FeaturedCarousel } from "@/components/site/featured-carousel";
import { getHomeContent } from "./hooks/use-home-data";

export async function HomePage() {
  const { products, featured, currentYear } = await getHomeContent();

  return (
    <div className="md:space-y-24 space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-[2rem] overflow-hidden bg-primary p-10 md:p-16 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm uppercase tracking-widest text-primary-foreground/80 font-bold">
            Coleção {currentYear}
          </p>
          <h1 className="text-4xl md:text-6xl font-black mt-4 leading-tight text-primary-foreground drop-shadow-sm">
            Moda que acende seu estilo
          </h1>
          <Link 
            href="#produtos" 
            className="inline-flex mt-8 h-14 items-center px-8 rounded-xl bg-background text-foreground font-bold hover:scale-105 transition-smooth shadow-lg"
          >
            Explorar coleção
          </Link>
        </div>
        
        {/* Detalhe decorativo que remete ao Primary Glow do seu CSS */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-glow/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Seção de Destaques com Carrossel */}
      {featured.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Destaques</h2>
            <div className="h-px flex-1 mx-8 bg-border/60 hidden md:block" />
          </div>
          <FeaturedCarousel products={featured} />
        </section>
      )}

      {/* Grid de Todos os Produtos */}
      <section id="produtos" className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Todos os produtos</h2>
        </div>
        
        {products.length === 0 ? (
          <div className="py-20 text-center border border-dashed rounded-3xl">
            <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <ProductCard key={i} product={p} index={i}/>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}