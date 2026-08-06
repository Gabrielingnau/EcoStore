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

  const rawWeight = watch("weight");
  const currentWeight = Number(String(rawWeight || "").replace(",", ".")) || 0;

  const getWeightFeedback = (val: number) => {
    if (val <= 0) return null;
    if (val < 1) {
      const grams = Math.round(val * 1000);
      return `= ${grams}g`;
    }
    return `= ${val}kg`;
  };

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      <div className="space-y-1">
        <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold">
          Descrição detalhada
        </Label>
        <Textarea
          placeholder="Descreva materiais, caimento, cuidados..."
          {...register("descricao")}
          className={cn("rounded-lg min-h-[100px] sm:min-h-[120px] text-xs p-2.5", errors.descricao && "border-destructive")}
        />
        {errors.descricao && <span className="text-[10px] text-destructive block">{String(errors.descricao.message)}</span>}
      </div>

      <div className="space-y-2 pt-1">
        <Label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold block">
          Peso e dimensões (Cálculo de frete)
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {logisticsFields.map((field) => {
            const fieldError = errors[field.name as keyof typeof errors];
            const fieldValue = watch(field.name);
            const isWeight = field.name === "weight";

            return (
              <div key={field.name} className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <Label className="text-[9px] sm:text-[10px] uppercase text-muted-foreground truncate">
                    {field.label}
                  </Label>
                  {isWeight && currentWeight > 0 && (
                    <span className="text-[9px] font-bold text-primary animate-fade-in shrink-0 whitespace-nowrap">
                      {getWeightFeedback(currentWeight)}
                    </span>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder={isWeight ? "Ex: 0.5" : "0"}
                  value={fieldValue ?? ""}
                  onChange={(e) => {
                    const masked = maskDecimal(e.target.value);
                    setValue(field.name, masked, { shouldValidate: true });
                  }}
                  className={cn("rounded-lg h-9 sm:h-10 text-xs px-2.5", fieldError && "border-destructive")}
                />
                {fieldError && <span className="text-[9px] text-destructive block truncate">{String(fieldError.message)}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}