"use client";

import { ShoppingBag, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/lib/store/cart";
import { formatBRL, cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type ProductRowWithAtivo = Database["public"]["Tables"]["products"]["Row"] & {
  ativo?: boolean;
};

interface ProductCardProps {
  product: ProductRowWithAtivo;
  isAdmin?: boolean;
  actions?: React.ReactNode;
  index?: number;
}

export function ProductCard({
  product,
  isAdmin = false,
  actions,
}: ProductCardProps) {
  const add = useCart((s) => s.add);
  const isAtivo = product.ativo !== false;
  const isOutOfStock = product.estoque <= 0;

  return (
    <div className={cn(
      "group flex flex-col rounded-[var(--radius)] overflow-hidden bg-card border border-border shadow-sm transition-all hover:shadow-md relative",
      isAdmin && !isAtivo && "opacity-75 grayscale"
    )}>
      
      {/* 1. Imagem */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.imagem_url}
          alt={product.nome}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center font-bold text-[10px] uppercase tracking-widest z-20">
            Esgotado
          </div>
        )}
      </div>

      {/* 2. Conteúdo do Card (Adicionado relative z-20 para ficar acima do link) */}
      <div className="p-2.5 md:p-3 flex flex-col flex-grow gap-1 relative z-20">
        
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold truncate">
            {product.categoria}
          </span>
          <h3 className="text-xs md:text-sm font-semibold text-foreground line-clamp-2 leading-tight">
            {product.nome}
          </h3>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-black text-primary text-sm md:text-base">
              {formatBRL(product.preco)}
            </span>
            <span className="text-[9px] text-muted-foreground">
              {product.estoque > 0 ? `${product.estoque} em estoque` : "Sem estoque"}
            </span>
          </div>

          {!isAdmin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                add(product, 1);
              }}
              disabled={isOutOfStock}
              className={cn(
                "h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center transition-all cursor-pointer",
                isOutOfStock ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:scale-110"
              )}
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Ações ADMIN */}
        {isAdmin && actions && (
          <div className="mt-2 pt-2 border-t border-border flex gap-1">
            {actions}
          </div>
        )}
      </div>

      {/* 3. Link Fantasma (z-10, abaixo do conteúdo z-20) */}
      {(isAtivo || !isAdmin) && (
        <Link 
          href={`/produto/${product.id}`} 
          className="absolute inset-0 z-10" 
          aria-label={product.nome} 
        />
      )}
    </div>
  );
}