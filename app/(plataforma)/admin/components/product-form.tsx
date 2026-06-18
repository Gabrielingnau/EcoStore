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

  useEffect(() => {
    reset(initialValues);
  }, [product, reset]);

  const imagemUrlCapa = watch("imagem_url");

  const onSubmit = (data: FormDataState) => {
    handleSaveSubmit(data);
  };

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-md animate-fade-in w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {isEdit ? "Editar Produto" : "Novo Produto"}
          </CardTitle>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground" disabled={saving}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">Nome</Label>
              <Input className="rounded-xl" {...register("nome")} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">Categoria</Label>
              <Input className="rounded-xl" {...register("categoria")} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">Preço</Label>
              <Controller control={control} name="preco" render={({ field }) => (
                <Input value={maskBRL(field.value)} onChange={(e) => field.onChange(parseBRLToStringDigits(e.target.value))} />
              )}/>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">Estoque</Label>
              <Controller control={control} name="estoque" render={({ field }) => (
                <Input value={field.value === 0 ? "" : field.value} onChange={(e) => field.onChange(Number(maskOnlyNumbers(e.target.value)))} />
              )}/>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Descrição</Label>
            <Textarea className="rounded-xl min-h-[100px]" {...register("descricao")} />
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase text-muted-foreground">Imagem de Capa</Label>
            {imagemUrlCapa && (
              <div className="relative h-32 w-28 rounded-xl overflow-hidden border">
                <Image src={imagemUrlCapa} alt="capa" fill className="object-cover" />
                <button type="button" onClick={() => setValue("imagem_url", "")} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
            <label className="flex items-center gap-2 h-10 px-4 rounded-xl bg-secondary cursor-pointer text-xs font-semibold w-fit">
              <Upload className="h-3.5 w-3.5" /> Upload Capa
              <input type="file" className="hidden" onChange={(e) => handleMainImageUpload(e, (url) => setValue("imagem_url", url))} />
            </label>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Label className="text-xs uppercase text-muted-foreground">Galeria Adicional</Label>
            <div className="grid grid-cols-4 gap-2">
              {extraImages.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border">
                  <Image src={img.url} alt="" fill className="object-cover" />
                  <button type="button" onClick={() => handleRemoveExtraImage(img.id, img.isNewLocal)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 h-10 px-4 rounded-xl bg-secondary cursor-pointer text-xs font-semibold w-fit">
              <Upload className="h-3.5 w-3.5" /> Adicionar Mídias
              <input type="file" multiple className="hidden" onChange={handleExtraImagesUpload} />
            </label>
          </div>

          {/* AÇÕES DE ENVIO RESPONSIVAS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button type="submit" disabled={saving || uploading} className="w-full sm:flex-1 h-12 rounded-xl font-bold">
              {saving ? "Salvando..." : "Salvar Produto"}
            </Button>
            <Button type="button" variant="outline" className="w-full sm:w-auto h-12 rounded-xl font-bold" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}