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
import { ArrowRight } from "lucide-react";
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
    <div className="w-full relative px-4 md:px-0">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product, index) => {
            const SlideContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative aspect-[16/10] rounded-xl overflow-hidden bg-card border border-border shadow-lg group"
              >
                {/* Imagem de Fundo */}
                <img
                  src={product.imagem_url}
                  alt={product.nome}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay Gradiente utilizando cores do tema */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                {/* Conteúdo sobre a imagem */}
                <div className="absolute inset-0 p-6 md:p-10 flex items-end justify-between">
                  <div className="flex flex-col gap-1 md:gap-2">
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary font-bold">
                      {product.destaque ? "Destaque" : "Catálogo"}
                    </span>
                    <h3 className="text-xl md:text-4xl font-black text-foreground drop-shadow-sm line-clamp-1">
                      {product.nome}
                    </h3>
                    <p className="text-lg md:text-3xl font-black text-primary">
                      {formatBRL(product.preco)}
                    </p>

                    {isAdmin && actions && (
                      <div
                        className="mt-4 flex gap-2 relative z-30"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actions(product)}
                      </div>
                    )}
                  </div>

                  {!isAdmin && (
                    <div className="hidden md:flex h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary text-primary-foreground items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <ArrowRight className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                  )}
                </div>
              </motion.div>
            );

            return (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-[90%] md:basis-[70%] lg:basis-[60%]"
              >
                {isAdmin ? (
                  <div className="block relative z-20">{SlideContent}</div>
                ) : (
                  <Link href={`/produto/${product.id}`} className="block">
                    {SlideContent}
                  </Link>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="hidden md:block">
          <CarouselPrevious className="left-4 h-12 w-12 bg-secondary/80 backdrop-blur-md border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors" />
          <CarouselNext className="right-4 h-12 w-12 bg-secondary/80 backdrop-blur-md border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors" />
        </div>
      </Carousel>
    </div>
  );
}