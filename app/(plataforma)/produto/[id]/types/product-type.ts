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

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  position: number;
  created_at: string;
}

  export type ProductImagesDatabase = (Database["public"]["Tables"]["product_images"]["Row"])[];
  export type ProductDatabase = (Database["public"]["Tables"]["products"]["Row"]);