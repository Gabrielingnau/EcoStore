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
            className="p-4 border border-border rounded-lg animate-pulse bg-muted/50 h-20"
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
      <div className="p-6 border border-amber-200 rounded-lg text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
        <div>
          <p className="font-semibold text-amber-800">Frete indisponível</p>
          <p className="text-sm text-amber-700">
            Verifique o CEP ou utilize outro endereço.
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
          className="border-amber-200"
        ></Button>
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
              "relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border hover:border-accent hover:bg-accent/50",
            )}
            onClick={() => onSelect(rate)}
          >
            <RadioGroupItem value={rate.id} id={rate.id} className="mr-4" />

            <label
              htmlFor={rate.id}
              className="flex-1 flex justify-between items-center cursor-pointer"
            >
              <div>
                <p className="font-semibold text-foreground">{displayName}</p>
                <p className="text-sm text-muted-foreground font-medium">
                  {rate.delivery_time
                    ? `Entrega em até ${typeof rate.delivery_time === "object" ? rate.delivery_time.max : rate.delivery_time} dias úteis`
                    : "Prazo não informado"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-foreground">
                  {price === 0 ? "Grátis" : formatBRL(price)}
                </p>
              </div>
            </label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
