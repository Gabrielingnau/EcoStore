import { Database } from "@/types/database";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

// Estendemos o produto para aceitar os dados da variante escolhida
export type CartProduct = ProductRow & {
  variant_id?: string;
  variant_size_id?: string;
  cor?: string;
  tamanho?: string;
  // Se a variante tiver uma imagem própria, podemos sobrescrever a principal aqui
  imagem_url: string; 
};

export type CartItem = { 
  product: CartProduct; 
  quantity: number; 
};