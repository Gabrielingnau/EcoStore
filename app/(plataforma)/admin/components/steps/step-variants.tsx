"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function StepVariants() {
  const { control, register, watch, setValue, formState: { errors } } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    control,
    name: "variants",
  });

  const variants = watch("variants") || [];

  const handleAddVariant = () => {
    const isFirst = fields.length === 0;
    append({
      cor: "",
      padrao_tecido: "",
      is_principal: isFirst,
      imagens: [],
      sizes: [
        {
          tamanho: "",
          estoque: 0,
          sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
        },
      ],
    });
  };

  const handleSetPrincipal = (selectedIndex: number) => {
    variants.forEach((_: any, idx: any) => {
      const isTarget = idx === selectedIndex;
      setValue(`variants.${idx}.is_principal`, isTarget, { shouldValidate: true });

      if (isTarget) {
        const targetImages = variants[idx]?.imagens || [];
        const firstImg = targetImages.length > 0 
          ? (typeof targetImages[0] === "string" ? targetImages[0] : targetImages[0]?.url) 
          : "";
        setValue("imagem_url", firstImg || "", { shouldValidate: true });
      }
    });
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newLocalImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
      isNew: true,
    }));

    const currentImages = variants[index]?.imagens || [];
    const updatedImages = [...currentImages, ...newLocalImages];

    setValue(`variants.${index}.imagens`, updatedImages, { shouldValidate: true });

    const isPrincipalVariant = variants[index]?.is_principal || (index === 0 && variants.every((v: any) => !v.is_principal));
    if (isPrincipalVariant && updatedImages.length > 0) {
      setValue("imagem_url", updatedImages[0].url, { shouldValidate: true });
    }
  };

  const handleRemoveImage = (variantIndex: number, imgIndex: number) => {
    const currentImages = [...(variants[variantIndex]?.imagens || [])];
    currentImages.splice(imgIndex, 1);
    setValue(`variants.${variantIndex}.imagens`, currentImages, { shouldValidate: true });

    const isPrincipalVariant = variants[variantIndex]?.is_principal;
    if (isPrincipalVariant) {
      const newFirst = currentImages[0];
      const newCapaUrl = newFirst ? (typeof newFirst === "string" ? newFirst : newFirst.url) : "";
      setValue("imagem_url", newCapaUrl, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {fields.map((field, index) => {
        const variantError = (errors?.variants as any)?.[index];
        const isCurrentPrincipal = variants[index]?.is_principal;

        return (
          <div key={field.id} className={cn("p-5 rounded-2xl border bg-card/50 space-y-4 relative transition-all", isCurrentPrincipal ? "border-primary ring-1 ring-primary/20" : "border-border")}>
            <div className="flex items-center justify-between">
              <div className="grid sm:grid-cols-2 gap-4 flex-1 mr-4">
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground font-semibold">Cor</Label>
                  <Input
                    placeholder="Ex: Azul"
                    {...register(`variants.${index}.cor`)}
                    className={cn("rounded-xl h-10", variantError?.cor && "border-destructive")}
                  />
                  {variantError?.cor && <span className="text-[10px] text-destructive">{variantError.cor.message}</span>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground font-semibold">Estampa / Padrão</Label>
                  <Input
                    placeholder="Ex: Xadrez ou Liso"
                    {...register(`variants.${index}.padrao_tecido`)}
                    className="rounded-xl h-10"
                  />
                </div>
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="radio"
                name="variant_principal_selector"
                id={`principal-${index}`}
                checked={isCurrentPrincipal}
                onChange={() => handleSetPrincipal(index)}
                className="h-4 w-4 border-border text-primary focus:ring-primary cursor-pointer"
              />
              <Label htmlFor={`principal-${index}`} className="text-xs font-semibold text-muted-foreground cursor-pointer">
                Tornar esta a variação principal (define a capa do produto)
              </Label>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/40">
              <Label className="text-xs uppercase text-muted-foreground font-semibold">
                Fotos desta cor — A primeira foto será a capa se esta for a principal
              </Label>
              <div className="flex flex-wrap gap-3">
                {variants[index]?.imagens?.map((imgItem: any, imgIdx: number) => {
                  const displayUrl = typeof imgItem === "string" ? imgItem : imgItem?.url;

                  return (
                    <div key={imgIdx} className="relative h-20 w-20 rounded-xl overflow-hidden border border-border group">
                      <img src={displayUrl} alt="" className="h-full w-full object-cover" />
                      {imgIdx === 0 && isCurrentPrincipal && (
                        <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          CAPA
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index, imgIdx)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
                <label className="h-20 w-20 rounded-xl border border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-primary transition-colors bg-secondary/30">
                  <Upload className="h-5 w-5 mb-1" />
                  <span className="text-[10px]">Adicionar</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(index, e)} />
                </label>
              </div>
              {variantError?.imagens && <span className="text-[10px] text-destructive block mt-1">{variantError.imagens.message}</span>}
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={handleAddVariant}
        className="w-full h-12 rounded-xl border-dashed border-border hover:border-primary text-xs font-semibold gap-2"
      >
        <Plus className="h-4 w-4" /> Adicionar variação de cor
      </Button>
    </div>
  );
}