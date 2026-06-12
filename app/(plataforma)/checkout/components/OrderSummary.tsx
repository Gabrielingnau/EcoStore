"use client";

import { formatBRL } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface OrderSummaryProps {
  items: any[];
  shipping: any;
  total: number;
}

export function OrderSummary({ items, shipping, total }: OrderSummaryProps) {
  return (
    <Card className="border border-border shadow-md">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-bold text-lg">Resumo da compra</h3>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4">
              <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted">
                <Image 
                  src={item.product.imagem_url} 
                  alt={item.product.nome} 
                  fill 
                  className="object-cover" 
                  sizes="64px"
                />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium">{item.product.nome}</p>
                <p className="text-muted-foreground">
                  {item.quantity}x {formatBRL(item.product.preco)}
                </p>
              </div>
              <span className="font-bold">
                {formatBRL(item.product.preco * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Frete {shipping ? `(${shipping.company.name} - ${shipping.name})` : ""}
            </span>
            <span className="font-medium">
              {shipping ? formatBRL(Number(shipping.price)) : "Calculando..."}
            </span>
          </div>
          <div className="flex justify-between font-bold text-xl pt-2 border-t text-primary">
            <span>Total</span>
            <span>{formatBRL(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}