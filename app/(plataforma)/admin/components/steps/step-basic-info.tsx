"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function StepBasicInfo() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const condicao = watch("condicao");

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
        <div className="space-y-1">
          <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold">
            Título do produto
          </Label>
          <Input 
            placeholder="Ex: Camiseta Oversized Algodão Premium" 
            {...register("nome")} 
            className={cn("rounded-lg h-9 sm:h-10 text-xs", errors.nome && "border-destructive")} 
          />
          {errors.nome && <span className="text-[10px] text-destructive block">{String(errors.nome.message)}</span>}
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold">
            Marca
          </Label>
          <Input 
            placeholder="Ex: IgniteWear" 
            {...register("marca")} 
            className={cn("rounded-lg h-9 sm:h-10 text-xs", errors.marca && "border-destructive")} 
          />
          {errors.marca && <span className="text-[10px] text-destructive block">{String(errors.marca.message)}</span>}
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold">
            Modelo
          </Label>
          <Input 
            placeholder="Ex: Street 2.0" 
            {...register("modelo")} 
            className={cn("rounded-lg h-9 sm:h-10 text-xs", errors.modelo && "border-destructive")} 
          />
          {errors.modelo && <span className="text-[10px] text-destructive block">{String(errors.modelo.message)}</span>}
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold">
            Categoria
          </Label>
          <Input 
            placeholder="Ex: Roupas" 
            {...register("categoria")} 
            className={cn("rounded-lg h-9 sm:h-10 text-xs", errors.categoria && "border-destructive")} 
          />
          {errors.categoria && <span className="text-[10px] text-destructive block">{String(errors.categoria.message)}</span>}
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold">
          Condição
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setValue("condicao", "novo", { shouldValidate: true })}
            className={cn(
              "p-2.5 sm:p-3 rounded-lg border text-left font-semibold text-xs transition-all",
              condicao === "novo" ? "border-primary bg-primary/10 text-foreground shadow-xs" : "border-border/60 bg-card text-muted-foreground hover:border-border"
            )}
          >
            Novo
          </button>
          <button
            type="button"
            onClick={() => setValue("condicao", "usado", { shouldValidate: true })}
            className={cn(
              "p-2.5 sm:p-3 rounded-lg border text-left font-semibold text-xs transition-all",
              condicao === "usado" ? "border-primary bg-primary/10 text-foreground shadow-xs" : "border-border/60 bg-card text-muted-foreground hover:border-border"
            )}
          >
            Usado
          </button>
        </div>
        {errors.condicao && <span className="text-[10px] text-destructive block">{String(errors.condicao.message)}</span>}
      </div>
    </div>
  );
}