"use client";

import { Package, Store } from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatBRL } from "@/lib/utils";

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
    <Label htmlFor={id} className="cursor-pointer block">
      <div
        className={cn(
          "flex items-center justify-between p-4 border-2 rounded-2xl transition-all bg-card",
          "border-border/60 hover:border-primary/40 hover:bg-secondary/40",
          "has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-sm",
        )}
      >
        <div className="flex items-center gap-3.5">
          <RadioGroupItem value={id} id={id} />
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isPickup ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600")}>
            {isPickup ? <Store size={20} /> : <Package size={20} />}
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-sm text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">
              {isPickup
                ? "Retirada gratuita na loja física"
                : "Entrega expressa realizada pela própria loja"}
            </p>
            <p className="text-xs font-semibold text-primary pt-0.5">Prazo: {delivery_time}</p>
          </div>
        </div>
        <span className={cn("font-extrabold text-sm", price === 0 ? "text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg" : "text-foreground")}>
          {price === 0 ? "Grátis" : formatBRL(price)}
        </span>
      </div>
    </Label>
  );
}