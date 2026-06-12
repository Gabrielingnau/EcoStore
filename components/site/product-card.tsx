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
  index,
}: ProductCardProps) {
  const add = useCart((s) => s.add);
  const isAtivo = product.ativo !== false;

  return (
    <div 
      className={cn(
        "group relative rounded-[var(--radius)] overflow-hidden bg-card border border-border shadow-md aspect-[4/5] transition-all duration-300",
        isAdmin && !isAtivo && "border-muted"
      )}
    >
      
      {/* 🔴 ENVELOPE VISUAL */}
      <div className={cn(
        "absolute inset-0 transition-all duration-300",
        isAdmin && !isAtivo && "opacity-40 grayscale"
      )}>
        <Image
          src={product.imagem_url}
          alt={product.nome}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* 2. BADGE DE INATIVIDADE */}
      {isAdmin && !isAtivo && (
        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md text-muted-foreground border border-border text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider z-30 flex items-center gap-1.5 shadow-lg select-none pointer-events-none">
          <EyeOff className="h-3 w-3" /> Inativo
        </div>
      )}

      {/* 3. O LINK FANTASMA */}
      {(isAtivo || !isAdmin) && (
        <Link 
          href={`/produto/${product.id}`} 
          className="absolute inset-0 z-0"
          aria-label={`Ver detalhes de ${product.nome}`}
        />
      )}

      {/* 4. Conteúdo do Card */}
      <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-end gap-1 pointer-events-none z-20">
        
        <span className={cn(
          "text-[10px] uppercase tracking-widest text-muted-foreground font-bold truncate",
          isAdmin && !isAtivo && "text-muted-foreground/60"
        )}>
          {product.categoria}
        </span>

        <h3 className={cn(
          "font-bold text-base md:text-lg text-foreground line-clamp-1 leading-tight",
          isAdmin && !isAtivo && "text-muted-foreground line-through decoration-muted-foreground/50"
        )}>
          {product.nome}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <span className={cn(
            "font-black text-primary text-lg truncate",
            isAdmin && !isAtivo && "text-muted-foreground"
          )}>
            {formatBRL(product.preco)}
          </span>

          {!isAdmin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                add(product, 1);
              }}
              disabled={product.estoque <= 0}
              className="hidden md:flex h-10 w-10 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all items-center justify-center pointer-events-auto relative z-20"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 5. AÇÕES DO ADMIN */}
        {isAdmin && actions && (
          <div className="mt-3 pt-2 border-t border-border flex gap-2 pointer-events-auto relative z-30">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}