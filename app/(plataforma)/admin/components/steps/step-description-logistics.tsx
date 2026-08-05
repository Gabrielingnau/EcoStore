"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn, maskDecimal } from "@/lib/utils";

export function StepDescriptionLogistics() {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const logisticsFields = [
    { name: "weight", label: "Peso (kg)" },
    { name: "width", label: "Largura (cm)" },
    { name: "height", label: "Altura (cm)" },
    { name: "length", label: "Comprimento (cm)" },
  ];

  // Converte a string digitada para número apenas para o feedback visual instantâneo
  const rawWeight = watch("weight");
  const currentWeight = Number(String(rawWeight || "").replace(",", ".")) || 0;

  const getWeightFeedback = (val: number) => {
    if (val <= 0) return null;
    if (val < 1) {
      const grams = Math.round(val * 1000);
      return `= ${grams} grama${grams > 1 ? "s" : ""}`;
    }
    return `= ${val} quilo${val > 1 ? "s" : ""}`;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-2">
        <Label className="text-xs uppercase text-muted-foreground font-semibold">Descrição detalhada</Label>
        <Textarea
          placeholder="Descreva os materiais, caimento, cuidados de lavagem..."
          {...register("descricao")}
          className={cn("rounded-xl min-h-[140px]", errors.descricao && "border-destructive")}
        />
        {errors.descricao && <span className="text-[10px] text-destructive">{String(errors.descricao.message)}</span>}
      </div>

      <div className="space-y-3 pt-2">
        <Label className="text-xs uppercase text-muted-foreground font-semibold">Peso e dimensões (Usados no cálculo de frete)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {logisticsFields.map((field) => {
            const fieldError = errors[field.name as keyof typeof errors];
            const fieldValue = watch(field.name);
            const isWeight = field.name === "weight";

            return (
              <div key={field.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] uppercase text-muted-foreground">{field.label}</Label>
                  {isWeight && currentWeight > 0 && (
                    <span className="text-[10px] font-medium text-primary animate-fade-in">
                      {getWeightFeedback(currentWeight)}
                    </span>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder={isWeight ? "Ex: 0.5 ou 7" : "0"}
                  value={fieldValue ?? ""}
                  onChange={(e) => {
                    const masked = maskDecimal(e.target.value);
                    // Salvamos diretamente como string no form para o input não travar nunca a digitação
                    setValue(field.name, masked, { shouldValidate: true });
                  }}
                  className={cn("rounded-xl h-11", fieldError && "border-destructive")}
                />
                {fieldError && <span className="text-[10px] text-destructive">{String(fieldError.message)}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}