"use client";

import { AlertCircle, Settings } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatBRL } from "@/lib/utils";

interface ShippingOptionsProps {
  options: any[];
  isLoading: boolean;
  onSelect: (rate: any) => void;
  selectedId: string;
}

export function ShippingOptions({
  options,
  isLoading,
  onSelect,
  selectedId,
}: ShippingOptionsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-4 border border-border/60 rounded-2xl animate-pulse bg-secondary/40 h-20"
          />
        ))}
      </div>
    );
  }

  const validOptions = Array.isArray(options)
    ? options.filter((o) => o?.id !== undefined && o?.price !== undefined)
    : [];

  if (validOptions.length === 0) {
    return (
      <div className="p-6 border border-amber-500/30 bg-amber-500/5 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
        <div>
          <p className="font-bold text-foreground">Frete indisponível</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verifique o CEP cadastrado ou utilize outro endereço.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <Link href="/endereco">
              <Settings className="w-4 h-4 mr-2" /> Gerenciar endereços
            </Link>
          }
          className="rounded-xl border-amber-500/30 hover:bg-amber-500/10"
        />
      </div>
    );
  }

  return (
    <RadioGroup
      value={selectedId}
      onValueChange={(id) => {
        const selected = validOptions.find((o) => o.id === id);
        if (selected) onSelect(selected);
      }}
      className="grid gap-3"
    >
      {validOptions.map((rate) => {
        const isSelected = selectedId === rate.id;
        const price = Number(rate.price);

        const displayName =
          rate.company?.name !== rate.name
            ? `${rate.company?.name} - ${rate.name}`
            : rate.name;

        return (
          <div
            key={rate.id}
            className={cn(
              "relative flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all bg-card",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border/60 hover:border-primary/40 hover:bg-secondary/40",
            )}
            onClick={() => onSelect(rate)}
          >
            <RadioGroupItem value={rate.id} id={rate.id} className="mr-4" />

            <label
              htmlFor={rate.id}
              className="flex-1 flex justify-between items-center cursor-pointer"
            >
              <div className="space-y-0.5">
                <p className="font-bold text-sm text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  {rate.delivery_time
                    ? `Entrega em até ${typeof rate.delivery_time === "object" ? rate.delivery_time.max : rate.delivery_time} dias úteis`
                    : "Prazo não informado"}
                </p>
              </div>

              <div className="text-right">
                <span className={cn("font-extrabold text-sm", price === 0 ? "text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg" : "text-foreground")}>
                  {price === 0 ? "Grátis" : formatBRL(price)}
                </span>
              </div>
            </label>
          </div>
        );
      })}
    </RadioGroup>
  );
}