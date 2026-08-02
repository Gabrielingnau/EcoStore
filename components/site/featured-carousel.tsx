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
import { ArrowRight, Tag } from "lucide-react";
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
        <CarouselContent>
          {products.map((product, index) => {
            // Lógica de Preço Promocional e % OFF
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

            const SlideContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative aspect-[16/10] rounded-xl overflow-hidden bg-card border border-border shadow-lg group"
              >
                {/* Imagem de Fundo (Totalmente visível) */}
                <img
                  src={product.imagem_url}
                  alt={product.nome}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Sombra suave apenas na parte inferior para leitura do texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge no Topo: Destaque e % OFF */}
                <div className="absolute top-3 left-3 md:top-4 md:left-4 flex items-center gap-2 z-10">
                  {product.destaque && (
                    <span className="bg-primary/90 text-primary-foreground text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                      Destaque
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-emerald-600 text-white font-extrabold text-[10px] md:text-xs px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {percentageOff}% OFF
                    </span>
                  )}
                </div>

                {/* Informações na Parte Inferior */}
                <div className="absolute inset-0 p-4 md:p-8 flex items-end justify-between z-10">
                  <div className="flex flex-col gap-1 max-w-[75%] md:max-w-[80%]">
                    {/* Marca e Categoria */}
                    <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-wider text-primary font-bold">
                      {product.marca && <span>{product.marca}</span>}
                      {product.marca && product.categoria && <span>•</span>}
                      {product.categoria && <span>{product.categoria}</span>}
                    </div>

                    {/* Nome do Produto */}
                    <h3 className="text-lg md:text-3xl font-black text-white drop-shadow-md line-clamp-1">
                      {product.nome}
                    </h3>

                    {/* Preços */}
                    <div className="flex items-baseline gap-2 mt-0.5">
                      {hasDiscount && (
                        <span className="text-xs md:text-lg text-white/70 line-through font-semibold">
                          {formatBRL(product.preco)}
                        </span>
                      )}
                      <span className="text-xl md:text-3xl font-black text-primary drop-shadow-md">
                        {formatBRL(finalPrice)}
                      </span>
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

                  {!isAdmin && (
                    <div className="hidden md:flex h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary text-primary-foreground items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0">
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