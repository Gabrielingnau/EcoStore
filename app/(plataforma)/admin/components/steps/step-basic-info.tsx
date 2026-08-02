"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function StepBasicInfo() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const condicao = watch("condicao");

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-semibold">Título do produto</Label>
          <Input placeholder="Ex: Camiseta Oversized Algodão Premium" {...register("nome")} className={cn("rounded-xl h-11", errors.nome && "border-destructive")} />
          {errors.nome && <span className="text-[10px] text-destructive">{String(errors.nome.message)}</span>}
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-semibold">Marca</Label>
          <Input placeholder="Ex: IgniteWear" {...register("marca")} className={cn("rounded-xl h-11", errors.marca && "border-destructive")} />
          {errors.marca && <span className="text-[10px] text-destructive">{String(errors.marca.message)}</span>}
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-semibold">Modelo</Label>
          <Input placeholder="Ex: Street 2.0" {...register("modelo")} className={cn("rounded-xl h-11", errors.modelo && "border-destructive")} />
          {errors.modelo && <span className="text-[10px] text-destructive">{String(errors.modelo.message)}</span>}
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-semibold">Categoria</Label>
          <Input placeholder="Ex: Roupas" {...register("categoria")} className={cn("rounded-xl h-11", errors.categoria && "border-destructive")} />
          {errors.categoria && <span className="text-[10px] text-destructive">{String(errors.categoria.message)}</span>}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Label className="text-xs uppercase text-muted-foreground font-semibold">Condição</Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("condicao", "novo", { shouldValidate: true })}
            className={cn(
              "p-4 rounded-xl border text-left font-semibold transition-all",
              condicao === "novo" ? "border-primary bg-primary/10 text-foreground shadow-sm" : "border-border/60 bg-card text-muted-foreground hover:border-border"
            )}
          >
            Novo
          </button>
          <button
            type="button"
            onClick={() => setValue("condicao", "usado", { shouldValidate: true })}
            className={cn(
              "p-4 rounded-xl border text-left font-semibold transition-all",
              condicao === "usado" ? "border-primary bg-primary/10 text-foreground shadow-sm" : "border-border/60 bg-card text-muted-foreground hover:border-border"
            )}
          >
            Usado
          </button>
        </div>
        {errors.condicao && <span className="text-[10px] text-destructive">{String(errors.condicao.message)}</span>}
      </div>
    </div>
  );
}