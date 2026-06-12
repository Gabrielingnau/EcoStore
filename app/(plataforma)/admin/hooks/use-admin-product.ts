"use client";

import { parseDigitsToFloat } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { revalidateProductFull } from "@/lib/actions/revalidate";
import {
  deleteExtraImage,
  fetchExtraImages,
  saveProductWithGallery,
  uploadStorageFile,
} from "../services/admin-service";
import type {
  FormDataState,
  LocalProductImage,
  ProductRow,
} from "../types/admin-types";

export function useAdminProduct(
  product?: ProductRow | null,
  onSaved?: () => void,
) {
  const queryClient = useQueryClient();
  const isEdit = !!product;

  const [mainImageFile, setMainImageFile] = useState<File | undefined>(
    undefined,
  );
  const [extraImages, setExtraImages] = useState<LocalProductImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const initialValues: FormDataState = {
    nome: product?.nome ?? "",
    descricao: product?.descricao ?? "",
    preco: product?.preco ?? "",
    categoria: product?.categoria ?? "",
    estoque: product?.estoque ?? 0,
    destaque: product?.destaque ?? false,
    imagem_url: product?.imagem_url ?? "",
    // Inicialização dos novos campos
    weight: Number(product?.weight) || 0,
    width: Number(product?.width) || 0,
    height: Number(product?.height) || 0,
    length: Number(product?.length) || 0,
  };

  const { data: dbImages } = useQuery({
    queryKey: ["product-images", product?.id],
    queryFn: () => fetchExtraImages(product!.id),
    enabled: isEdit && !!product?.id,
  });

  useEffect(() => {
    if (dbImages) {
      setExtraImages(
        dbImages.map((img: any) => ({ id: img.id, url: img.url })),
      );
    }
  }, [dbImages]);

  const saveMutation = useMutation({
    mutationFn: (payload: any) => saveProductWithGallery(payload),
    onSuccess: async (finalId: string) => {
      await revalidateProductFull(finalId);
      toast.success(
        isEdit
          ? "Catálogo atualizado com sucesso."
          : "Novo item registrado com sucesso!",
      );
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
      queryClient.invalidateQueries({ queryKey: ["product-images", finalId] });
      if (onSaved) onSaved();
    },
    onError: (err: any) =>
      toast.error(err.message || "Falha ao gravar alterações."),
  });

  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onFieldChange?: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEdit && product) {
      setUploading(true);
      try {
        const url = await uploadStorageFile(file);
        if (onFieldChange) onFieldChange(url);
        await revalidateProductFull(product.id);
        toast.success("Imagem de capa atualizada.");
      } catch (err: any) {
        toast.error("Erro no upload da capa.");
      } finally {
        setUploading(false);
      }
    } else {
      const objectUrl = URL.createObjectURL(file);
      setMainImageFile(file);
      if (onFieldChange) onFieldChange(objectUrl);
      toast.info("Imagem de capa selecionada.");
    }
  };

  const handleExtraImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (isEdit && product) {
      setUploading(true);
      try {
        await Promise.all(
          files.map(async (file, index) => {
            const url = await uploadStorageFile(file);
            const { supabaseBrowser } = await import("@/lib/supabase/client");
            const { data } = await (supabaseBrowser() as any)
              .from("product_images")
              .insert({
                product_id: product.id,
                url,
                position: extraImages.length + index,
              })
              .select()
              .single();

            if (data) {
              setExtraImages((prev) => [
                ...prev,
                { id: data.id, url: data.url },
              ]);
            }
          }),
        );
        await revalidateProductFull(product.id);
        toast.success("Mídias adicionadas em paralelo.");
      } catch (err: any) {
        toast.error("Falha no upload em lote.");
      } finally {
        setUploading(false);
      }
    } else {
      const localPreviews: LocalProductImage[] = files.map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file: file,
        isNewLocal: true,
      }));
      setExtraImages((prev) => [...prev, ...localPreviews]);
      toast.info(`${files.length} imagens adicionadas ao rascunho.`);
    }
    e.target.value = "";
  };

  const handleRemoveExtraImage = async (id: string, isNewLocal?: boolean) => {
    try {
      if (isEdit && !isNewLocal) {
        await deleteExtraImage(id);
        await revalidateProductFull(product?.id);
      }
      setExtraImages((prev) => prev.filter((img) => img.id !== id));
      toast.success("Imagem removida.");
    } catch (err: any) {
      toast.error("Não foi possível remover.");
    }
  };

  const handleSaveSubmit = (submittedData: FormDataState) => {
    const { preco, ...restOfForm } = submittedData;
    const sanitizedForm = {
      ...restOfForm,
      preco: typeof preco === "number" ? preco : parseDigitsToFloat(preco),
    };

    saveMutation.mutate({
      form: sanitizedForm,
      productId: product?.id,
      localExtraImages: extraImages,
      mainImageFile: mainImageFile,
    });
  };

  return {
    initialValues,
    extraImages,
    saving: saveMutation.isPending,
    uploading,
    isEdit,
    handleMainImageUpload,
    handleExtraImagesUpload,
    handleRemoveExtraImage,
    handleSaveSubmit,
  };
}
