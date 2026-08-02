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

            return (
              <div key={field.name} className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">{field.label}</Label>
                <Input
                  type="text"
                  placeholder="0"
                  value={fieldValue ?? ""}
                  onChange={(e) => {
                    const masked = maskDecimal(e.target.value);
                    setValue(field.name, masked === "" ? 0 : Number(masked), { shouldValidate: true });
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