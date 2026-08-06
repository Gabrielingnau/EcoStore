"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/lib/types/admin-types";
import { formatBRL } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Tag, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

interface FeaturedCarouselProps {
  products: Product[];
  isAdmin?: boolean;
  actions?: (product: Product) => React.ReactNode;
}

export function FeaturedCarousel({
  products,
  isAdmin = false,
  actions,
}: FeaturedCarouselProps) {
  return (
    <div className="w-full relative px-2 md:px-0">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product, index) => {
            const hasDiscount =
              product.preco_promocional !== null &&
              product.preco_promocional !== undefined &&
              product.preco_promocional < product.preco;

            const percentageOff = hasDiscount
              ? Math.round(
                  ((product.preco - Number(product.preco_promocional)) /
                    product.preco) *
                    100
                )
              : 0;

            const finalPrice = hasDiscount
              ? product.preco_promocional!
              : product.preco;

            const isLcpCandidate = index === 0;

            const SlideContent = (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="relative flex flex-col rounded-md overflow-hidden bg-card border-2 border-primary/20 shadow-sm hover:shadow-md transition-all group h-full"
              >
                {/* Container fixo e estritamente quadrado (aspect-square) para mobile e desktop */}
                <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
                  <Image
                    src={product.imagem_url || "/placeholder.png"}
                    alt={product.nome}
                    fill
                    priority={isLcpCandidate}
                    // @ts-ignore
                    fetchPriority={isLcpCandidate ? "high" : "auto"}
                    sizes="(max-width: 768px) 55vw, 40vw"
                    /* object-cover garante preenchimento total e perfeito do container */
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Informações sempre abaixo da foto */}
                <div className="p-3 md:p-5 flex flex-col justify-between flex-1 bg-card border-t border-border/40">
                  <div className="flex flex-col gap-1.5 md:gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {product.destaque && (
                        <span className="bg-amber-500 text-slate-950 font-black text-[9px] md:text-xs px-2 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 fill-slate-950" aria-hidden="true" />
                          Destaque
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="bg-emerald-400 text-emerald-950 font-black text-[9px] md:text-xs px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-xs">
                          <Tag className="w-2.5 h-2.5 md:w-3 md:h-3" aria-hidden="true" />
                          {percentageOff}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      {product.marca && <span>{product.marca}</span>}
                      {product.marca && product.categoria && <span>•</span>}
                      {product.categoria && <span>{product.categoria}</span>}
                    </div>

                    <h3 className="text-xs md:text-lg font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {product.nome}
                    </h3>

                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-border/20">
                      <div className="flex items-baseline gap-2">
                        {hasDiscount && (
                          <span className="text-[11px] md:text-sm text-muted-foreground line-through font-semibold">
                            {formatBRL(product.preco)}
                          </span>
                        )}
                        <span className="text-base md:text-2xl font-extrabold text-primary">
                          {formatBRL(finalPrice)}
                        </span>
                      </div>

                      {!isAdmin && (
                        <div className="hidden md:flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                          Ver Detalhes
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    {isAdmin && actions && (
                      <div
                        className="mt-2 flex gap-2 relative z-30"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actions(product)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );

            return (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 basis-[52%] sm:basis-[48%] md:basis-[45%] lg:basis-[38%]"
              >
                {isAdmin ? (
                  <div className="block relative z-20 h-full">{SlideContent}</div>
                ) : (
                  <Link 
                    href={`/produto/${product.id}`} 
                    className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                    aria-label={`Ver produto em destaque: ${product.nome}`}
                  >
                    {SlideContent}
                  </Link>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="hidden md:block">
          <CarouselPrevious className="-left-3 h-10 w-10 bg-background/90 backdrop-blur-md border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md" />
          <CarouselNext className="-right-3 h-10 w-10 bg-background/90 backdrop-blur-md border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md" />
        </div>
      </Carousel>
    </div>
  );
}