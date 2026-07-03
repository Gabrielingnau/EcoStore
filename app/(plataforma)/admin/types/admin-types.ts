import * as yup from "yup";

import type { Database } from "@/types/database";

// Tipos base do Banco de Dados
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

// Schema de validação reestruturado
export const productFormSchema = yup.object({
  nome: yup.string().required("O nome é obrigatório"),
  descricao: yup
    .string()
    .required("A descrição é obrigatória")
    .min(10, "Mínimo 10 caracteres"),
  categoria: yup.string().required("A categoria é obrigatória"),
  preco: yup.lazy((val) =>
    typeof val === "number"
      ? yup.number().required()
      : yup.string().required("O preço é obrigatório"),
  ),
  // Mude de .min(0) para .min(1)
  estoque: yup
    .number()
    .typeError("Deve ser um número")
    .integer()
    .min(1, "Estoque deve ser maior que 0")
    .required("Estoque obrigatório"),
  destaque: yup.boolean().default(false),
  imagem_url: yup.string().required("A imagem é obrigatória"),

  // Novos campos de logística
  weight: yup
    .number()
    .typeError("Peso inválido")
    .min(0.001, "Peso deve ser maior que 0")
    .required("Peso é obrigatório"),
  width: yup
    .number()
    .typeError("Largura inválida")
    .min(1, "Mínimo 1cm")
    .required("Largura é obrigatória"),
  height: yup
    .number()
    .typeError("Altura inválida")
    .min(1, "Mínimo 1cm")
    .required("Altura é obrigatória"),
  length: yup
    .number()
    .typeError("Comprimento inválido")
    .min(1, "Mínimo 1cm")
    .required("Comprimento é obrigatório"),
});

export type FormDataState = yup.InferType<typeof productFormSchema>;
