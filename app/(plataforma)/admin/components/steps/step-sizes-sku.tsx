"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, maskOnlyNumbers } from "@/lib/utils";

export function StepSizesSku() {
  const { control, register, formState: { errors } } = useFormContext();
  const variants = control._formValues.variants || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {variants.map((variant: any, vIndex: number) => (
        <VariantSizeSection
          key={vIndex}
          variantIndex={vIndex}
          variant={variant}
          control={control}
          register={register}
          errors={errors}
        />
      ))}
    </div>
  );
}

function VariantSizeSection({ variantIndex, variant, control, register, errors }: {
  variantIndex: number;
  variant: any;
  control: any;
  register: any;
  errors: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.sizes`,
  });

  const variantErrors = (errors?.variants as any)?.[variantIndex];

  const handleAddSize = () => {
    append({
      tamanho: "",
      estoque: 0,
      sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
      codigo_universal: "",
    });
  };

  return (
    <div className="p-5 rounded-2xl border border-border bg-card/50 space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div>
          <h4 className="text-sm font-bold text-foreground">{variant.cor || "Cor sem nome"}</h4>
          <span className="text-xs text-muted-foreground">{variant.padrao_tecido || "Padrão normal"}</span>
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((sizeField, sIndex) => {
          const sizeError = variantErrors?.sizes?.[sIndex];

          return (
            <div key={sizeField.id} className="grid sm:grid-cols-12 gap-3 items-end p-3 rounded-xl border border-border/60 bg-background">
              <div className="sm:col-span-3 space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">Tamanho</Label>
                <select
                  {...register(`variants.${variantIndex}.sizes.${sIndex}.tamanho`)}
                  className={cn(
                    "w-full h-10 px-3 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
                    sizeError?.tamanho && "border-destructive"
                  )}
                >
                  <option value="">Selecione...</option>
                  {["PP", "P", "M", "G", "GG", "XG", "38", "40", "42", "44", "Único"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {sizeError?.tamanho && <span className="text-[9px] text-destructive">{String(sizeError.tamanho.message)}</span>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">Estoque</Label>
                <Input
                  type="number"
                  {...register(`variants.${variantIndex}.sizes.${sIndex}.estoque`, { valueAsNumber: true })}
                  className={cn("rounded-xl h-10 text-xs", sizeError?.estoque && "border-destructive")}
                />
                {sizeError?.estoque && <span className="text-[9px] text-destructive">{String(sizeError.estoque.message)}</span>}
              </div>

              <div className="sm:col-span-4 space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">SKU único</Label>
                <Input
                  {...register(`variants.${variantIndex}.sizes.${sIndex}.sku`)}
                  className={cn("rounded-xl h-10 text-xs", sizeError?.sku && "border-destructive")}
                />
                {sizeError?.sku && <span className="text-[9px] text-destructive">{String(sizeError.sku.message)}</span>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">EAN (Opcional)</Label>
                <Input
                  placeholder="Código de barras"
                  {...register(`variants.${variantIndex}.sizes.${sIndex}.codigo_universal`)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div className="sm:col-span-1 flex justify-center pb-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(sIndex)}
                  className="text-muted-foreground hover:text-destructive h-9 w-9"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddSize}
        className="w-full h-10 rounded-xl border-dashed border-border hover:border-primary text-xs font-semibold gap-2"
      >
        <Plus className="h-3.5 w-3.5" /> Adicionar tamanho
      </Button>
    </div>
  );
}