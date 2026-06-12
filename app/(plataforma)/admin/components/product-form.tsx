"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Trash2, Upload, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { maskBRL, parseBRLToStringDigits, maskOnlyNumbers, cn } from "@/lib/utils";

// Importações dos arquivos limpos e unificados
import { useAdminProduct } from "../hooks/use-admin-product";
import { productFormSchema, type FormDataState } from "../types/admin-types";
import type { ProductRow } from "../types/admin-types";

interface ProductFormProps {
  product: ProductRow | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ProductForm(props: ProductFormProps) {
  const { onClose, product, onSaved } = props;
  
  // 1. Puxa a lógica do hook focado nas mídias e mutações
  const {
    initialValues,
    extraImages,
    saving,
    uploading,
    isEdit,
    handleMainImageUpload,
    handleExtraImagesUpload,
    handleRemoveExtraImage,
    handleSaveSubmit,
  } = useAdminProduct(product, onSaved);

  // 2. Configura o formulário com o yup schema unificado
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormDataState>({
    resolver: yupResolver(productFormSchema),
    defaultValues: initialValues,
  });

  // Otimização de Performance: Sincroniza o formulário se o produto mudar no pai sem desmontar o componente
  useEffect(() => {
    reset(initialValues);
  }, [product, reset]);

  const imagemUrlCapa = watch("imagem_url");

  const onSubmit = (data: FormDataState) => {
    handleSaveSubmit(data);
  };

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-md animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {isEdit ? "Editar Especificações do Produto" : "Mapear Novo Produto"}
          </CardTitle>
          <button 
            type="button"
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-all duration-200 focus:outline-none" 
            aria-label="Fechar"
            disabled={saving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Input Nome */}
            <div className="space-y-2">
              <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Nome</Label>
              <Input 
                className={cn("rounded-xl border-border bg-muted/20", errors.nome && "border-destructive")} 
                {...register("nome")}
              />
              {errors.nome && <span className="text-xs text-destructive">{errors.nome.message}</span>}
            </div>

            {/* Input Categoria */}
            <div className="space-y-2">
              <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Categoria</Label>
              <Input 
                className={cn("rounded-xl border-border bg-muted/20", errors.categoria && "border-destructive")} 
                {...register("categoria")}
              />
              {errors.categoria && <span className="text-xs text-destructive">{errors.categoria.message}</span>}
            </div>
            
            {/* Preço de Venda */}
            <div className="space-y-2">
              <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Preço de Venda</Label>
              <Controller
                control={control}
                name="preco"
                render={({ field }) => (
                  <Input 
                    type="text"
                    className={cn("rounded-xl border-border bg-muted/20 font-medium", errors.preco && "border-destructive")}
                    value={maskBRL(field.value)} 
                    onChange={(e) => field.onChange(parseBRLToStringDigits(e.target.value))} 
                  />
                )}
              />
              {errors.preco && <span className="text-xs text-destructive">{errors.preco.message}</span>}
            </div>
            
            {/* Unidades em Estoque */}
            <div className="space-y-2">
              <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Unidades em Estoque</Label>
              <Controller
                control={control}
                name="estoque"
                render={({ field }) => (
                  <Input 
                    type="text"
                    className={cn("rounded-xl border-border bg-muted/20 font-medium", errors.estoque && "border-destructive")}
                    value={field.value === 0 ? "" : field.value} 
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(maskOnlyNumbers(e.target.value)))} 
                  />
                )}
              />
              {errors.estoque && <span className="text-xs text-destructive">{errors.estoque.message}</span>}
            </div>
          </div>
          
          {/* Descrição Completa */}
          <div className="space-y-2">
            <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Descrição Completa</Label>
            <Textarea 
              className={cn("rounded-xl border-border bg-muted/20 min-h-24 resize-none", errors.descricao && "border-destructive")} 
              {...register("descricao")}
            />
            {errors.descricao && <span className="text-xs text-destructive">{errors.descricao.message}</span>}
          </div>

          {/* CHECKBOX DESTAQUE */}
          <label className="flex items-center gap-3 cursor-pointer select-none bg-muted/20 border border-border/60 p-3 rounded-xl w-fit">
            <input 
              type="checkbox" 
              {...register("destaque")}
              className="h-5 w-5 rounded-md border border-border bg-zinc-900 cursor-pointer appearance-none checked:bg-black checked:border-zinc-700 relative after:content-[''] after:absolute after:hidden checked:after:block after:left-[6px] after:top-[2px] after:w-[6px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-white after:rotate-45 transition-colors duration-200" 
            />
            <span className="text-sm font-semibold text-foreground">Destakar produto na vitrine principal</span>
          </label>

          {/* NOVA SEÇÃO: LOGÍSTICA */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">Dados de Envio (Logística)</h3>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Medidas da peça dobrada</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Largura (cm)</Label>
                <Input type="number" {...register("width")} className="rounded-xl border-border bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Comprimento (cm)</Label>
                <Input type="number" {...register("length")} className="rounded-xl border-border bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Altura/Espessura (cm)</Label>
                <Input type="number" {...register("height")} className="rounded-xl border-border bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Peso (kg)</Label>
                <Input type="number" step="0.001" {...register("weight")} className="rounded-xl border-border bg-muted/20" placeholder="0.200" />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground bg-muted/30 p-3 rounded-lg leading-relaxed">
              <strong>Dica:</strong> A "Largura" e "Comprimento" devem considerar a peça dobrada pronta para a caixa. A "Altura" é a espessura final. Use o peso em Kg (ex: 0.200 para 200g).
            </p>
          </div>

          {/* IMAGEM DE CAPA */}
          <div className="space-y-3">
            <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block">Imagem de Capa (Proporção Recomendada 4:5)</Label>
            {imagemUrlCapa && (
              <div className="relative h-44 w-36 rounded-xl overflow-hidden bg-muted border border-border/40 shadow-inner">
                <Image src={imagemUrlCapa} alt="capa" fill sizes="144px" className="object-cover" />
              </div>
            )}
            <label className={cn("inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-accent border border-border/40 transition-all duration-200 cursor-pointer text-xs font-semibold", errors.imagem_url && "border-destructive")}>
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Sincronizando arquivo..." : "Upload foto de capa"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMainImageUpload(e, (url) => setValue("imagem_url", url, { shouldValidate: true }))} disabled={uploading || saving} />
            </label>
            {errors.imagem_url && <p className="text-xs text-destructive">{errors.imagem_url.message}</p>}
          </div>

          {/* GALERIA DE FOTOS */}
          <div className="space-y-3 border-t border-border/40 pt-4">
            <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block">
              Galeria de Mídia do Carrossel (Imagens Adicionais) {extraImages.length > 0 && `(${extraImages.length})`}
            </Label>
            {extraImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {extraImages.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-muted border border-border/40">
                    <Image src={img.url} alt="" fill sizes="90px" className="object-cover" />
                    <button type="button" onClick={() => handleRemoveExtraImage(img.id, img.isNewLocal)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center text-white">
                      <Trash2 className="h-4 w-4 text-destructive-foreground hover:scale-110 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-accent border border-border/40 transition-all duration-200 cursor-pointer text-xs font-semibold mt-2">
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Sincronizando mídias..." : "Adicionar fotos em lote"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleExtraImagesUpload} disabled={uploading || saving} />
            </label>
          </div>

          {/* AÇÕES DE ENVIO */}
          <div className="flex gap-2 pt-4 border-t border-border/40">
            <Button type="submit" disabled={saving || uploading} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold px-6">
              {saving ? "Salvando dados e mídias..." : "Salvar Produto"}
            </Button>
            <Button type="button" variant="outline" className="rounded-xl font-semibold" onClick={onClose} disabled={saving}>Cancelar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}