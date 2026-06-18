"use client";

import { Package, Store } from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface ShippingCardProps {
  id: string;
  name: string;
  price: number;
  delivery_time: string;
  type: "local_delivery" | "pickup";
}

export function ShippingCard({
  id,
  name,
  price,
  delivery_time,
  type,
}: ShippingCardProps) {
  const isPickup = type === "pickup";

  return (
    <Label htmlFor={id} className="cursor-pointer">
      <div
        className={cn(
          "flex items-center justify-between p-4 border rounded-lg transition-all",
          "has-[:checked]:border-primary has-[:checked]:bg-primary/5",
        )}
      >
        <div className="flex items-center gap-4">
          <RadioGroupItem value={id} id={id} />
          {isPickup ? (
            <Store className="text-amber-600" />
          ) : (
            <Package className="text-emerald-600" />
          )}
          <div>
            <p className="font-bold">{name}</p>
            <p className="text-xs text-muted-foreground">
              {isPickup
                ? "Retirada gratuita na loja"
                : "A loja se responsabiliza pela entrega"}
            </p>
            <p className="text-xs font-medium mt-1">Prazo: {delivery_time}</p>
          </div>
        </div>
        <span className="font-bold">
          {price === 0 ? "Grátis" : `R$ ${price.toFixed(2).replace(".", ",")}`}
        </span>
      </div>
    </Label>
  );
}
