"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, maskBRL, parseDigitsToFloat, maskOnlyNumbers } from "@/lib/utils";

export function StepPricingWarranty() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  
  const garantiaTipo = watch("garantia_tipo");
  const permiteRetirada = watch("permite_retirada");
  const destaque = watch("destaque");
  
  const precoRaw = watch("preco");
  const precoPromoRaw = watch("preco_promocional");

  const preco = parseDigitsToFloat(precoRaw || 0);
  const precoPromocional = parseDigitsToFloat(precoPromoRaw || 0);

  let descontoPercentual = 0;
  if (preco > 0 && precoPromocional > 0 && precoPromocional < preco) {
    descontoPercentual = Math.round(((preco - precoPromocional) / preco) * 100);
  }

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
        <div className="space-y-1">
          <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold">
            Preço regular (R$)
          </Label>
          <Input 
            placeholder="R$ 0,00" 
            value={maskBRL(precoRaw)}
            onChange={(e) => {
              const numericFloat = parseDigitsToFloat(e.target.value);
              setValue("preco", numericFloat, { shouldValidate: true });
            }}
            className={cn("rounded-lg h-9 sm:h-10 text-xs", errors.preco && "border-destructive")} 
          />
          {errors.preco && <span className="text-[10px] text-destructive block">{String(errors.preco.message)}</span>}
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold">
            Preço promocional (Opcional)
          </Label>
          <div className="relative flex items-center">
            <Input 
              placeholder="R$ 0,00" 
              value={maskBRL(precoPromoRaw)}
              onChange={(e) => {
                const numericFloat = parseDigitsToFloat(e.target.value);
                setValue("preco_promocional", numericFloat > 0 ? numericFloat : null, { shouldValidate: true });
              }}
              className={cn("rounded-lg h-9 sm:h-10 text-xs pr-16", errors.preco_promocional && "border-destructive")} 
            />
            
            {descontoPercentual > 0 && (
              <span className="absolute right-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md whitespace-nowrap">
                {descontoPercentual}% OFF
              </span>
            )}
          </div>
          {errors.preco_promocional && <span className="text-[10px] text-destructive block">{String(errors.preco_promocional.message)}</span>}
        </div>
      </div>

      <div className="space-y-2 pt-1 border-t border-border/40">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="permite_retirada"
            checked={permiteRetirada}
            onChange={(e) => setValue("permite_retirada", e.target.checked, { shouldValidate: true })}
            className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
          <Label htmlFor="permite_retirada" className="text-xs font-medium text-foreground cursor-pointer select-none">
            Permite retirada pessoalmente
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="destaque"
            checked={destaque}
            onChange={(e) => setValue("destaque", e.target.checked, { shouldValidate: true })}
            className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
          <Label htmlFor="destaque" className="text-xs font-medium text-foreground cursor-pointer select-none">
            Marcar como destaque na home
          </Label>
        </div>
      </div>

      <div className="space-y-1.5 pt-1 border-t border-border/40">
        <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold">
          Garantia
        </Label>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          {[
            { id: "vendedor", label: "Vendedor" },
            { id: "fabrica", label: "Fábrica" },
            { id: "nenhuma", label: "Sem garantia" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setValue("garantia_tipo", item.id, { shouldValidate: true })}
              className={cn(
                "p-2 sm:p-3 rounded-lg border text-center sm:text-left font-medium text-[11px] sm:text-xs transition-all truncate",
                garantiaTipo === item.id ? "border-primary bg-primary/10 text-foreground font-bold shadow-xs" : "border-border/60 bg-card text-muted-foreground hover:border-border"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        {errors.garantia_tipo && <span className="text-[10px] text-destructive block">{String(errors.garantia_tipo.message)}</span>}
      </div>

      {garantiaTipo !== "nenhuma" && (
        <div className="space-y-1 max-w-[160px] sm:max-w-xs">
          <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold">
            Dias de garantia
          </Label>
          <Input 
            type="text" 
            value={watch("garantia_dias") ?? ""}
            onChange={(e) => {
              const numeric = maskOnlyNumbers(e.target.value);
              setValue("garantia_dias", numeric === "" ? 0 : Number(numeric), { shouldValidate: true });
            }}
            placeholder="Ex: 90" 
            className={cn("rounded-lg h-9 sm:h-10 text-xs", errors.garantia_dias && "border-destructive")} 
          />
          {errors.garantia_dias && <span className="text-[10px] text-destructive block">{String(errors.garantia_dias.message)}</span>}
        </div>
      )}
    </div>
  );
}