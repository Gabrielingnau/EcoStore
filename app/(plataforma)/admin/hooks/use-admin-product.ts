"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchExtraImages,
  saveProductWithGallery,
} from "../services/admin-service";

import { revalidateProductFull } from "@/lib/actions/revalidate";
import { parseDigitsToFloat } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  const [mainImageFile, setMainImageFile] = useState<File | undefined>(undefined);
  const [extraImages, setExtraImages] = useState<LocalProductImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const initialValues: FormDataState = {
    nome: product?.nome ?? "",
    descricao: product?.descricao ?? "",
    preco: product?.preco ?? "",
    categoria: product?.categoria ?? "",
    estoque: product?.estoque ?? 0,
    destaque: product?.destaque ?? false,
    imagem_url: product?.imagem_url ?? "",
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
      setExtraImages(dbImages.map((img: any) => ({ id: img.id, url: img.url })));
      setImagesToDelete([]); // Reseta fila ao carregar novas imagens
    }
  }, [dbImages]);

  const saveMutation = useMutation({
    mutationFn: (payload: any) => saveProductWithGallery(payload),
    onSuccess: async (finalId: string) => {
      await revalidateProductFull(finalId);
      toast.success(
        isEdit ? "Catálogo atualizado com sucesso." : "Novo item registrado com sucesso!"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
      queryClient.invalidateQueries({ queryKey: ["product-images", finalId] });
      setImagesToDelete([]); // Limpa a fila após sucesso
      if (onSaved) onSaved();
    },
    onError: (err: any) =>
      toast.error(err.message || "Falha ao gravar alterações."),
  });

  const handleMainImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onFieldChange?: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setMainImageFile(file);
    if (onFieldChange) onFieldChange(objectUrl);
    toast.info("Imagem de capa selecionada (será enviada ao salvar).");
  };

  const handleExtraImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const localPreviews: LocalProductImage[] = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file: file,
      isNewLocal: true,
    }));
    
    setExtraImages((prev) => [...prev, ...localPreviews]);
    toast.info(`${files.length} imagens adicionadas ao rascunho.`);
    e.target.value = "";
  };

  const handleRemoveExtraImage = (id: string, isNewLocal?: boolean) => {
    // Se não for local, adicionamos o ID na fila de exclusão para o salvamento final
    if (isEdit && !isNewLocal) {
      setImagesToDelete((prev) => [...prev, id]);
    }
    // Remove da tela imediatamente
    setExtraImages((prev) => prev.filter((img) => img.id !== id));
    toast.success("Imagem removida da visualização.");
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
      localExtraImages: extraImages.filter((img) => img.isNewLocal), // Apenas novas
      imagesToDelete: imagesToDelete, // IDs pendentes de exclusão
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