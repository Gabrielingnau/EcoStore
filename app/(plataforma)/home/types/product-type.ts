import { Database } from "@/types/database";

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  categoria: string;
  estoque: number;
  destaque: boolean;
  created_at: string;
}

export type ProductDatabase = (Database["public"]["Tables"]["products"]["Row"])[];