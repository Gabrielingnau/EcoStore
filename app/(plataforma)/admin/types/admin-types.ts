import type { Database } from "@/types/database";
import * as yup from "yup";

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
  descricao: yup.string().required("A descrição é obrigatória").min(10, "Mínimo 10 caracteres"),
  categoria: yup.string().required("A categoria é obrigatória"),
  preco: yup.lazy((val) => 
    typeof val === "number" ? yup.number().required() : yup.string().required("O preço é obrigatório")
  ),
  estoque: yup.number().typeError("Deve ser um número").integer().min(0).required("Estoque obrigatório"),
  destaque: yup.boolean().default(false),
  imagem_url: yup.string().required("A imagem é obrigatória"),
  
  // Novos campos de logística
  weight: yup.number().typeError("Peso inválido").min(0, "Mínimo 0").default(0),
  width: yup.number().typeError("Largura inválida").min(0, "Mínimo 0").default(0),
  height: yup.number().typeError("Altura inválida").min(0, "Mínimo 0").default(0),
  length: yup.number().typeError("Comprimento inválido").min(0, "Mínimo 0").default(0),
});

export type FormDataState = yup.InferType<typeof productFormSchema>;