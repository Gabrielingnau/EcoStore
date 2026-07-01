"use client";

import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CartItem, Product } from "./types";

interface CartState {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
}

const obterEstoqueSeguro = (estoque: any): number => {
  const num = Number(estoque);
  return Number.isNaN(num) || estoque === undefined || estoque === null
    ? 999
    : num;
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
        console.log("--- LOG ADICIONAR AO CARRINHO ---");
        console.log("Produto original recebido:", product);

        const items = get().items;
        const existing = items.find((i) => i.product.id === product.id);

        const estoqueDisponivel = obterEstoqueSeguro(product.estoque);
        
        const produtoTratado = {
          ...product,
          preco: obterPrecoSeguro(product.preco),
          estoque: estoqueDisponivel,
        };

        console.log("Produto tratado (que será salvo):", produtoTratado);

        const qtdAdicionar = Number.isNaN(quantity) ? 1 : quantity;

        if (existing) {
          console.log("Produto já existe, atualizando quantidade...");
          if (existing.quantity >= estoqueDisponivel) {
            toast.error(
              `Não é possível adicionar mais unidades de "${product.nome}". Limite de estoque atingido.`,
            );
            set({ open: true });
            return;
          }
        }

        const next = existing
          ? items.map((i) =>
              i.product.id === product.id
                ? {
                    ...i,
                    quantity: Math.min(
                      i.quantity + qtdAdicionar,
                      estoqueDisponivel,
                    ),
                    // Garantia: ao atualizar o existente, também garantimos os dados de logística
                    product: { ...i.product, ...produtoTratado }
                  }
                : i,
            )
          : [
              ...items,
              {
                product: produtoTratado,
                quantity: Math.min(qtdAdicionar, estoqueDisponivel),
              },
            ];

        console.log("Novo estado do carrinho:", next);
        set({ items: next, open: true });
      },
      remove: (id) =>
        set({ items: get().items.filter((i) => i.product.id !== id) }),

      updateQty: (id, qty) => {
        if (qty <= 0)
          return set({ items: get().items.filter((i) => i.product.id !== id) });

        const safeQty = Number.isNaN(qty) ? 1 : qty;
        let estoqueExcedido = false;
        let nomeProduto = "";

        const novosItens = get().items.map((i) => {
          if (i.product.id === id) {
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
          toast.error(
            `Desculpe, não temos mais unidades de "${nomeProduto}" em estoque.`,
          );
        }

        set({ items: novosItens });
      },
      clear: () => set({ items: [] }),
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