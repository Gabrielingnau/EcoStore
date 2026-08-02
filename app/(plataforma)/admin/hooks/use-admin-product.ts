"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { revalidateProductFull } from "@/lib/actions/revalidate";

import type {
  FormDataState,
  LocalProductImage,
  ProductRow,
} from "../types/admin-types";

import {
  fetchProductVariantsAndGuides,
  saveProductWithGallery,
} from "../services/admin-service";

export function useAdminProduct(
  product?: ProductRow | null,
  onSaved?: () => void,
) {
  const queryClient = useQueryClient();
  const isEdit = !!product;

  const [uploading, setUploading] = useState(false);
  const [extraImages, setExtraImages] = useState<LocalProductImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [sizeGuideState, setSizeGuideState] = useState<any>(null);

  // Define o padrão inicial vazio para novos produtos
  const defaultVariants = [
    {
      cor: "",
      padrao_tecido: "",
      is_principal: true,
      imagens: product?.imagem_url ? [product.imagem_url] : [],
      sizes: [
        {
          tamanho: "",
          estoque: product?.estoque ?? 0,
          sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
        },
      ],
    },
  ];

  const [variantsFormState, setVariantsFormState] = useState(defaultVariants);

  // Busca variantes e guia de tamanhos vinculados em caso de edição
  const { data: dbRelations } = useQuery({
    queryKey: ["product-admin-relations", product?.id],
    queryFn: () => fetchProductVariantsAndGuides(product!.id),
    enabled: isEdit && !!product?.id,
    staleTime: Infinity,
  });

  // Atualiza o estado das variantes e guias via useEffect controlado apenas quando os dados do banco chegam
  useEffect(() => {
    if (dbRelations) {
      if (dbRelations.variants && dbRelations.variants.length > 0) {
        const formattedVariants = dbRelations.variants.map((v: any) => ({
          id: v.id,
          cor: v.cor,
          padrao_tecido: v.padrao_tecido || "",
          is_principal: v.is_principal ?? false,
          imagens: Array.isArray(v.imagens) ? v.imagens : [],
          sizes: v.variant_sizes?.map((s: any) => ({
            id: s.id,
            tamanho: s.tamanho,
            estoque: s.estoque,
            sku: s.sku,
            codigo_universal: s.codigo_universal || "",
          })) || [],
        }));
        setVariantsFormState(formattedVariants);
      }

      if (dbRelations.sizeGuide) {
        setSizeGuideState(dbRelations.sizeGuide);
      }
    }
  }, [dbRelations]); // Executa com segurança estritamente quando o dbRelations mudar de undefined para os dados reais

  const initialValues: FormDataState = {
    nome: product?.nome ?? "",
    marca: product?.marca ?? "",
    modelo: product?.modelo ?? "",
    categoria: product?.categoria ?? "",
    condicao: (product?.condicao as "novo" | "usado") ?? "novo",
    
    descricao: product?.descricao ?? "",
    preco: product?.preco ?? 0,
    preco_promocional: product?.preco_promocional ?? null,
    destaque: product?.destaque ?? false,
    ativo: product?.ativo ?? true,
    imagem_url: product?.imagem_url ?? "",

    weight: Number(product?.weight) || 0,
    width: Number(product?.width) || 0,
    height: Number(product?.height) || 0,
    length: Number(product?.length) || 0,

    permite_retirada: product?.permite_retirada ?? false,
    garantia_tipo: (product?.garantia_tipo as "vendedor" | "fabrica" | "nenhuma") ?? "vendedor",
    garantia_dias: product?.garantia_dias ?? 0,

    // CORREÇÃO AQUI: Garante que o array de variantes reaja ao estado atualizado do banco
    variants: variantsFormState as any,
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: { form: FormDataState }): Promise<string> => {
      return await saveProductWithGallery({
        form: payload.form,
        productId: product?.id,
        localExtraImages: extraImages,
        imagesToDelete,
        sizeGuideData: sizeGuideState,
      });
    },
    onSuccess: async (finalId: string) => {
      await revalidateProductFull(finalId);
      toast.success(
        isEdit ? "Catálogo atualizado com sucesso." : "Novo item registrado com sucesso!"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
      queryClient.invalidateQueries({ queryKey: ["product-admin-relations", finalId] });
      if (onSaved) onSaved();
    },
    onError: (err: any) =>
      toast.error(err.message || "Falha ao gravar alterações."),
  });

  const handleSaveSubmit = (submittedData: FormDataState) => {
    saveMutation.mutate({ form: submittedData });
  };

  return {
    initialValues,
    saving: saveMutation.isPending,
    uploading,
    isEdit,
    sizeGuideState,
    setSizeGuideState,
    handleSaveSubmit,
  };
}