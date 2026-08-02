// types/admin-types.ts
import * as yup from "yup";

import type { Database } from "@/types/database";

// Tipos base direto do Database do Supabase
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

export interface OrderWithItems extends OrderRow {
  order_items: OrderItemRow[];
}

export interface LocalProductImage {
  id: string;
  url: string;
  file?: File;
  isNewLocal?: boolean;
}

// Tipos de Estado Auxiliares para as Etapas (Variantes e Tamanhos)
export interface VariantImageState {
  url: string; // URL remota (se já salva) ou URL temporária (blob)
  file?: File; // Arquivo cru caso o usuário tenha adicionado agora
  isNew?: boolean; // Identifica se precisa de upload
}

export interface VariantSizeState {
  id?: string;
  tamanho: string;
  estoque: number;
  sku: string;
  codigo_universal?: string;
  preco?: number;
}

export interface ProductVariantState {
  id?: string;
  cor: string;
  padrao_tecido?: string;
  is_principal: boolean;
  imagens: (string | VariantImageState)[];
  sizes: VariantSizeState[];
}

// --- Schemas Separados por Etapa ---

// Etapa 1: Informações Básicas
export const step1Schema = yup.object({
  nome: yup
    .string()
    .required("O nome é obrigatório")
    .max(60, "Máximo de 60 caracteres"),
  marca: yup.string().required("A marca é obrigatória"),
  modelo: yup.string().required("O modelo é obrigatório"),
  categoria: yup.string().required("A categoria é obrigatória"),
  condicao: yup
    .string()
    .oneOf(["novo", "usado"])
    .required("A condição é obrigatória"),
});

// Etapa 2: Cores e Fotos (Variantes sem exigir tamanhos aqui)
export const step2Schema = yup.object({
  variants: yup
    .array()
    .of(
      yup.object({
        id: yup.string().optional(),
        cor: yup.string().required("Cor obrigatória"),
        padrao_tecido: yup.string().nullable().optional(),
        is_principal: yup.boolean().required(),
        imagens: yup
          .array()
          .of(
            yup.mixed().test(
              "is-image-valid",
              "Imagem inválida",
              (value) => typeof value === "string" || (typeof value === "object" && value !== null)
            )
          )
          .min(1, "Adicione ao menos 1 foto para esta cor")
          .required("Imagens obrigatórias"),
      })
    )
    .min(1, "Adicione ao menos 1 variação de cor")
    .required("Variantes obrigatórias"),
});

// Etapa 3: Tamanhos e SKUs
export const step3Schema = yup.object({
  variants: yup
    .array()
    .of(
      yup.object({
        sizes: yup
          .array()
          .of(
            yup.object({
              id: yup.string().optional(),
              tamanho: yup.string().required("Tamanho obrigatório"),
              estoque: yup
                .number()
                .transform((value, originalValue) => (originalValue === "" ? 0 : value))
                .typeError("Deve ser número")
                .required("Estoque obrigatório"),
              sku: yup.string().required("SKU obrigatório"),
              codigo_universal: yup.string().nullable().optional(),
            })
          )
          .min(1, "Adicione ao menos 1 tamanho")
          .required("Tamanhos obrigatórios"),
      })
    )
    .required(),
});

// Etapa 4: Descrição e Logística
export const step4Schema = yup.object({
  descricao: yup
    .string()
    .required("A descrição é obrigatória")
    .min(10, "Mínimo 10 caracteres"),

  weight: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .typeError("Peso inválido")
    .min(0.001, "Peso deve ser maior que 0")
    .required("Peso é obrigatório"),
  width: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .typeError("Largura inválida")
    .min(1, "Mínimo 1cm")
    .required("Largura é obrigatória"),
  height: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .typeError("Altura inválida")
    .min(1, "Mínimo 1cm")
    .required("Altura é obrigatória"),
  length: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .typeError("Comprimento inválido")
    .min(1, "Mínimo 1cm")
    .required("Comprimento é obrigatório"),
});

// Etapa 5: Preço, Preço Promocional e Garantia
export const step5Schema = yup.object({
  preco: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .typeError("Preço inválido")
    .min(0, "O preço deve ser maior ou igual a 0")
    .required("O preço é obrigatório"),

  preco_promocional: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue == null ? null : value,
    )
    .typeError("Preço promocional inválido")
    .min(0, "O preço promocional deve ser maior ou igual a 0")
    .nullable()
    .optional(),

  permite_retirada: yup.boolean().default(false),
  destaque: yup.boolean().default(false), // <-- Adicionado aqui
  ativo: yup.boolean().default(true),      // <-- Adicionado aqui
  garantia_tipo: yup
    .string()
    .oneOf(["vendedor", "fabrica", "nenhuma"])
    .required("Tipo de garantia obrigatório"),
  garantia_dias: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue == null ? 0 : value,
    )
    .nullable()
    .required("Dias de garantia obrigatórios"),
});

// Schema completo unificado combinando todos os campos
export const productFormSchema = yup.object({
  ...step1Schema.fields,
  ...step2Schema.fields,
  ...step3Schema.fields,
  ...step4Schema.fields,
  ...step5Schema.fields,
  imagem_url: yup.string().optional().default(""),
});

export type FormDataState = yup.InferType<typeof productFormSchema>;