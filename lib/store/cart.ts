"use client";

import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartProduct } from "./types";

interface CartState {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: CartProduct, qty?: number) => void;
  remove: (id: string, variant_size_id?: string) => void;
  updateQty: (id: string, qty: number, variant_size_id?: string) => void;
  clear: () => void;
}

const obterEstoqueSeguro = (estoque: any): number => {
  const num = Number(estoque);
  return Number.isNaN(num) || estoque === undefined || estoque === null ? 999 : num;
};

const obterPrecoSeguro = (preco: any): number => {
  if (typeof preco === "number") return preco;
  if (!preco) return 0;
  let limpo = String(preco).replace(/[^\d.,]/g, "");
  if (limpo.includes(",") && limpo.includes(".")) {
    limpo = limpo.replace(/\./g, "").replace(",", ".");
  } else if (limpo.includes(",")) {
    limpo = limpo.replace(",", ".");
  }
  const num = Number(limpo);
  return Number.isNaN(num) ? 0 : num;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      setOpen: (open) => set({ open }),
      
      add: (product, quantity = 1) => {
        const items = get().items;
        
        // Identifica unicamente pelo ID do produto + ID do tamanho da variante
        const existingIndex = items.findIndex(
          (i) => 
            i.product.id === product.id && 
            i.product.variant_size_id === product.variant_size_id
        );

        const estoqueDisponivel = obterEstoqueSeguro(product.estoque);
        
        const produtoTratado: CartProduct = {
          ...product,
          estoque: estoqueDisponivel,
        };

        const qtdAdicionar = Number.isNaN(quantity) ? 1 : quantity;

        if (existingIndex > -1) {
          const currentItem = items[existingIndex];
          if (currentItem.quantity >= estoqueDisponivel) {
            toast.error(`Limite de estoque atingido para "${product.nome}" (${product.cor || ''} - ${product.tamanho || ''}).`);
            set({ open: true });
            return;
          }
        }

        let nextItems = [...items];
        if (existingIndex > -1) {
          nextItems[existingIndex] = {
            ...nextItems[existingIndex],
            quantity: Math.min(nextItems[existingIndex].quantity + qtdAdicionar, estoqueDisponivel),
          };
        } else {
          nextItems.push({
            product: produtoTratado,
            quantity: Math.min(qtdAdicionar, estoqueDisponivel),
          });
        }

        set({ items: nextItems, open: true });
      },

      remove: (id, variant_size_id) =>
        set({
          items: get().items.filter(
            (i) => !(i.product.id === id && i.product.variant_size_id === variant_size_id)
          ),
        }),

      updateQty: (id, qty, variant_size_id) => {
        if (qty <= 0) {
          return set({
            items: get().items.filter(
              (i) => !(i.product.id === id && i.product.variant_size_id === variant_size_id)
            ),
          });
        }

        const safeQty = Number.isNaN(qty) ? 1 : qty;
        let estoqueExcedido = false;
        let nomeProduto = "";

        const novosItens = get().items.map((i) => {
          if (i.product.id === id && i.product.variant_size_id === variant_size_id) {
            const estoqueDisponivel = obterEstoqueSeguro(i.product.estoque);
            nomeProduto = i.product.nome;

            if (safeQty > estoqueDisponivel) {
              estoqueExcedido = true;
              return { ...i, quantity: estoqueDisponivel };
            }

            return { ...i, quantity: safeQty };
          }
          return i;
        });

        if (estoqueExcedido) {
          toast.error(`Desculpe, estoque máximo atingido para "${nomeProduto}".`);
        }

        set({ items: novosItens });
      },

      clear: () => {
        set({ items: [] });
        if (typeof window !== "undefined") {
          localStorage.removeItem("ignite_cart_v2");
        }
      },
    }),
    { name: "ignite_cart_v2", partialize: (s) => ({ items: s.items }) },
  ),
);

export const useCartCount = () =>
  useCart((s) =>
    s.items.reduce(
      (acc, i) => acc + (Number.isNaN(i.quantity) ? 0 : i.quantity),
      0,
    ),
  );