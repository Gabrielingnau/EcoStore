"use client";

import { Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatBRL, cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type ProductRowExtended = Database["public"]["Tables"]["products"]["Row"] & {
  ativo?: boolean;
  destaque?: boolean;
  preco_promocional?: number | null;
  permite_retirada?: boolean;
};

interface ProductCardProps {
  product: ProductRowExtended;
  isAdmin?: boolean;
  actions?: React.ReactNode;
  index?: number;
}

export function ProductCard({
  product,
  isAdmin = false,
  actions,
}: ProductCardProps) {
  const isAtivo = product.ativo !== false;
  const isOutOfStock = product.estoque <= 0;

  // Lógica de preços e desconto
  const precoRegular = product.preco || 0;
  const precoPromo = product.preco_promocional;
  const temPromocao = precoPromo && precoPromo > 0 && precoPromo < precoRegular;
  
  const precoAtual = temPromocao ? precoPromo : precoRegular;
  
  let descontoPercentual = 0;
  if (temPromocao) {
    descontoPercentual = Math.round(((precoRegular - precoPromo) / precoRegular) * 100);
  }

  // Simulação de parcelamento (ex: até 10x sem juros)
  const parcelasMax = 10;
  const valorParcela = precoAtual / parcelasMax;

  return (
    <div className={cn(
      "group flex flex-col rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm transition-all hover:shadow-xl hover:border-border relative",
      isAdmin && !isAtivo && "opacity-75 grayscale"
    )}>
      
      {/* 1. Imagem mais fina / compacta */}
      <div className="relative aspect-12/12 overflow-hidden bg-muted/40 p-2.5 flex items-center justify-center">
        {product.destaque && (
          <span className="absolute top-2 left-2 z-20 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Zap className="h-2.5 w-2.5 fill-amber-500" /> Destaque
          </span>
        )}

        <Image
          src={product.imagem_url || "/placeholder.png"}
          alt={product.nome}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center font-bold text-xs uppercase tracking-widest z-20 text-muted-foreground">
            Esgotado
          </div>
        )}
      </div>

      {/* 2. Conteúdo do Card */}
      <div className="p-2.5 flex flex-col flex-grow gap-1.5 relative z-20 justify-between">
        
        <div className="space-y-0.5">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block truncate">
            {product.categoria || product.marca}
          </span>
          <h3 className="text-xs font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.nome}
          </h3>
        </div>

        <div className="space-y-0.5 pt-0.5">
          {/* Preço Riscado se houver promoção */}
          {temPromocao && (
            <span className="text-[10px] text-muted-foreground line-through block">
              {formatBRL(precoRegular)}
            </span>
          )}

          {/* Preço Principal e Badge de % OFF */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-foreground text-sm md:text-base tracking-tight">
              {formatBRL(precoAtual)}
            </span>

            {descontoPercentual > 0 && (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {descontoPercentual}% OFF
              </span>
            )}
          </div>

          {/* Simulação de Parcelamento */}
          <div className="text-[10px] text-emerald-600 font-medium">
            {parcelasMax}x {formatBRL(valorParcela)} sem juros
          </div>
        </div>

        {/* Rodapé do Card: Informação de Frete */}
        <div className="pt-2 border-t border-border/40 mt-auto">
          <span className="text-[10px] text-muted-foreground font-medium block">
            Frete calculado na hora da compra
          </span>
        </div>

        {/* Ações ADMIN */}
        {isAdmin && actions && (
          <div className="mt-2 pt-2 border-t border-border flex gap-1">
            {actions}
          </div>
        )}
      </div>

      {/* 3. Link Fantasma */}
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