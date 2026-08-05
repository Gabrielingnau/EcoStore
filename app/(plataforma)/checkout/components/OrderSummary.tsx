"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatBRL } from "@/lib/utils";

interface OrderSummaryProps {
  items: any[];
  shipping: any;
  total: number; // Pode ignorar ou usar apenas como fallback se necessário
}

export function OrderSummary({ items, shipping }: OrderSummaryProps) {
  const totalQty = items.reduce((acc, i) => acc + i.quantity, 0);

  // Cálculos consolidados usando preco_promocional
  const { originalSubtotal, currentSubtotal, totalEconomy } = items.reduce(
    (acc, i) => {
      const regularPrice = Number(i.product.preco) || 0;
      const promoPrice = i.product.preco_promocional ? Number(i.product.preco_promocional) : regularPrice;
      
      const effectivePrice = promoPrice > 0 && promoPrice < regularPrice ? promoPrice : regularPrice;

      acc.originalSubtotal += regularPrice * i.quantity;
      acc.currentSubtotal += effectivePrice * i.quantity;
      acc.totalEconomy += (regularPrice - effectivePrice) * i.quantity;

      return acc;
    },
    { originalSubtotal: 0, currentSubtotal: 0, totalEconomy: 0 }
  );

  const shippingPrice = shipping ? Number(shipping.price) : 0;
  const originalShippingPrice = shipping?.original_price ? Number(shipping.original_price) : 0;
  const shippingEconomy = originalShippingPrice > shippingPrice ? originalShippingPrice - shippingPrice : 0;
  
  const finalEconomy = totalEconomy + shippingEconomy;

  // CORREÇÃO: Calculamos o total real somando o subproduto com desconto + o preço do frete atual
  const calculatedTotal = currentSubtotal + shippingPrice;
  const calculatedOriginalTotal = originalSubtotal + (originalShippingPrice > 0 ? originalShippingPrice : shippingPrice);

  return (
    <Card className="border border-border/80 shadow-md rounded-2xl bg-card overflow-hidden">
      <CardContent className="p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-bold text-base text-foreground">Resumo da compra</h3>
          <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {totalQty} {totalQty === 1 ? "item" : "itens"}
          </span>
        </div>

        {/* Lista de Produtos */}
        <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
          {items.map((item, index) => {
            const regularPrice = Number(item.product.preco) || 0;
            const promoPrice = item.product.preco_promocional ? Number(item.product.preco_promocional) : 0;
            const hasDiscount = promoPrice > 0 && promoPrice < regularPrice;
            const finalItemPrice = hasDiscount ? promoPrice : regularPrice;

            return (
              <div 
                key={`${item.product.id}-${item.product.variant_size_id || index}`} 
                className="flex items-start gap-3.5 pb-3 border-b border-border/40 last:border-0 last:pb-0"
              >
                <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-muted shrink-0 border border-border/40">
                  <Image
                    src={item.product.imagem_url}
                    alt={item.product.nome}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0 text-xs space-y-1">
                  <p className="font-semibold text-foreground truncate">{item.product.nome}</p>
                  
                  {/* Exibição da Cor e Tamanho da Variante */}
                  {(item.product.cor || item.product.tamanho) && (
                    <p className="text-primary font-medium">
                      {item.product.cor ? `Cor: ${item.product.cor}` : ""}
                      {item.product.cor && item.product.tamanho ? " • " : ""}
                      {item.product.tamanho ? `Tamanho: ${item.product.tamanho}` : ""}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-muted-foreground">
                      {item.quantity}x{" "}
                      {hasDiscount && (
                        <span className="line-through mr-1 text-[10px]">
                          {formatBRL(regularPrice)}
                        </span>
                      )}
                      <span className={hasDiscount ? "font-bold text-foreground" : ""}>
                        {formatBRL(finalItemPrice)}
                      </span>
                    </span>
                    <span className="font-bold text-foreground">
                      {formatBRL(finalItemPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totais e Frete */}
        <div className="border-t border-border/60 pt-4 space-y-2.5 text-xs md:text-sm">
          {/* Subtotal */}
          <div className="flex justify-between text-muted-foreground items-center">
            <span>Produtos ({totalQty})</span>
            <div className="text-right">
              {originalSubtotal > currentSubtotal && (
                <span className="line-through text-xs text-muted-foreground mr-2">
                  {formatBRL(originalSubtotal)}
                </span>
              )}
              <span className="font-medium text-foreground">
                {formatBRL(currentSubtotal)}
              </span>
            </div>
          </div>

          {/* Frete */}
          <div className="flex justify-between text-muted-foreground items-center">
            <span>Envios</span>
            <div className="text-right">
              {shipping ? (
                Number(shipping.price) === 0 ? (
                  <div className="flex items-center gap-1.5 justify-end">
                    {originalShippingPrice > 0 && (
                      <span className="line-through text-xs text-muted-foreground">
                        {formatBRL(originalShippingPrice)}
                      </span>
                    )}
                    <span className="text-emerald-600 font-bold uppercase text-xs">
                      Grátis
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-foreground">
                    {formatBRL(Number(shipping.price))}
                  </span>
                )
              ) : (
                "A calcular"
              )}
            </div>
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-border/60 space-y-1">
            <div className="flex justify-between font-black text-lg md:text-xl text-primary items-center">
              <span>Total</span>
              <div className="text-right flex flex-col items-end">
                {calculatedOriginalTotal > calculatedTotal && (
                  <span className="line-through text-xs text-muted-foreground font-normal">
                    {formatBRL(calculatedOriginalTotal)}
                  </span>
                )}
                <span>{formatBRL(calculatedTotal)}</span>
              </div>
            </div>

            {/* Badge de Economia Total Estilo Mercado Livre */}
            {finalEconomy > 0 && (
              <div className="flex items-center justify-end gap-2 pt-1 text-xs font-semibold text-emerald-600">
                <span>Economize {formatBRL(finalEconomy)}</span>
                {Number(shipping?.price) === 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span>Frete grátis</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}