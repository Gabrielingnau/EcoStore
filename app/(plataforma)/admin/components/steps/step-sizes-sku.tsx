"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function StepSizesSku() {
  const { control, register, formState: { errors } } = useFormContext();
  const variants = control._formValues.variants || [];

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
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
    <div className="p-2.5 sm:p-4 rounded-xl border border-border bg-card/50 space-y-2.5">
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-foreground leading-tight">
            {variant.cor || "Cor sem nome"}
          </h4>
          <span className="text-[10px] sm:text-xs text-muted-foreground block">
            {variant.padrao_tecido || "Padrão normal"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {fields.map((sizeField, sIndex) => {
          const sizeError = variantErrors?.sizes?.[sIndex];

          return (
            <div 
              key={sizeField.id} 
              className="p-2.5 sm:p-3 rounded-lg border border-border/60 bg-background relative space-y-2"
            >
              <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-1.5">
                <span className="text-[10px] font-bold uppercase text-primary">
                  Item #{sIndex + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(sIndex)}
                  className="text-muted-foreground hover:text-destructive h-6 w-6 rounded-md -mr-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Grid Responsivo de Inputs - Dividido em 2 linhas no mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-3 items-start">
                
                {/* Linha 1 no Mobile: Tamanho (col-span-1) */}
                <div className="col-span-1 sm:col-span-3 space-y-1">
                  <Label className="text-[9px] sm:text-[10px] uppercase text-muted-foreground font-semibold">
                    Tamanho
                  </Label>
                  <select
                    {...register(`variants.${variantIndex}.sizes.${sIndex}.tamanho`)}
                    className={cn(
                      "w-full h-8 sm:h-9 px-2 rounded-md border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
                      sizeError?.tamanho && "border-destructive"
                    )}
                  >
                    <option value="">Selecione...</option>
                    {["PP", "P", "M", "G", "GG", "XG", "38", "40", "42", "44", "Único"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {sizeError?.tamanho && <span className="text-[9px] text-destructive block">{String(sizeError.tamanho.message)}</span>}
                </div>

                {/* Linha 1 no Mobile: Estoque (col-span-1) */}
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <Label className="text-[9px] sm:text-[10px] uppercase text-muted-foreground font-semibold">
                    Estoque
                  </Label>
                  <Input
                    type="number"
                    {...register(`variants.${variantIndex}.sizes.${sIndex}.estoque`, { valueAsNumber: true })}
                    className={cn("rounded-md h-8 sm:h-9 text-xs px-2.5", sizeError?.estoque && "border-destructive")}
                  />
                  {sizeError?.estoque && <span className="text-[9px] text-destructive block">{String(sizeError.estoque.message)}</span>}
                </div>

                {/* Linha 2 no Mobile: SKU Único (col-span-1 no mobile, 4 colunas no desktop) */}
                <div className="col-span-1 sm:col-span-4 space-y-1">
                  <Label className="text-[9px] sm:text-[10px] uppercase text-muted-foreground font-semibold">
                    SKU único
                  </Label>
                  <Input
                    {...register(`variants.${variantIndex}.sizes.${sIndex}.sku`)}
                    className={cn("rounded-md h-8 sm:h-9 text-xs px-2.5 font-mono", sizeError?.sku && "border-destructive")}
                  />
                  {sizeError?.sku && <span className="text-[9px] text-destructive block">{String(sizeError.sku.message)}</span>}
                </div>

                {/* Linha 2 no Mobile: EAN / Código Universal (col-span-1 no mobile, 3 colunas no desktop) */}
                <div className="col-span-1 sm:col-span-3 space-y-1">
                  <Label className="text-[9px] sm:text-[10px] uppercase text-muted-foreground font-semibold">
                    EAN (Opcional)
                  </Label>
                  <Input
                    placeholder="Cód. barras"
                    {...register(`variants.${variantIndex}.sizes.${sIndex}.codigo_universal`)}
                    className="rounded-md h-8 sm:h-9 text-xs px-2.5"
                  />
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddSize}
        className="w-full h-8 sm:h-9 rounded-lg border-dashed border-border hover:border-primary text-xs font-semibold gap-1.5"
      >
        <Plus className="h-3.5 w-3.5" /> Adicionar tamanho
      </Button>
    </div>
  );
}