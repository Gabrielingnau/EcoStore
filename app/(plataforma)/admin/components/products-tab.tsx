"use client";

import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteProductService,
  toggleProductActiveService,
} from "../services/admin-service";

import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import { revalidateProductFull } from "@/lib/actions/revalidate";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ProductRow } from "../types/admin-types";
import { ProductForm } from "./product-form"; // 👈 Garante que o form está importado

type ProductWithAtivo = ProductRow & { ativo?: boolean };

interface ProductsTabProps {
  products: ProductWithAtivo[];
}

export function ProductsTab({ products }: ProductsTabProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [creating, setCreating] = useState(false);

  // Mutação para Deletar para Sempre (Hard Delete)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProductService(id),
    onSuccess: async (_, id) => {
      await revalidateProductFull(id);
      toast.success("Produto removido definitivamente do catálogo.");
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Mutação para Ativar/Desativar (Soft Delete)
  const toggleActiveMutation = useMutation({
    mutationFn: ({
      id,
      currentStatus,
    }: {
      id: string;
      currentStatus: boolean;
    }) => toggleProductActiveService(id, currentStatus),
    onSuccess: async (_, variables) => {
      await revalidateProductFull(variables.id);
      toast.success(
        variables.currentStatus
          ? "Produto desativado e ocultado da vitrine."
          : "Produto reativado na vitrine!",
      );
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleHardDeleteClick = (
    e: React.MouseEvent,
    product: ProductWithAtivo,
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const confirmou = confirm(
      `⚠️ ALERTA DE EXCLUSÃO DEFINITIVA:\n\n` +
        `Você está prestes a deletar "${product.nome}" para sempre.\n\n` +
        `• O produto sumirá do painel.\n` +
        `• Pedidos antigos NÃO serão quebrados (o ID mudará para nulo no histórico, mas os dados de texto continuam salvos).\n\n` +
        `Deseja prosseguir?`,
    );

    if (confirmou) {
      deleteMutation.mutate(product.id);
    }
  };

  const handleToggleActiveClick = (
    e: React.MouseEvent,
    product: ProductWithAtivo,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const statusAtual = product.ativo !== false;

    toggleActiveMutation.mutate({ id: product.id, currentStatus: statusAtual });
  };

  return (
    <div className="space-y-6">
      {/* 🚀 BLOCO RESTAURADO: Seção de Criação e Edição de Produtos no topo */}
      <div className="space-y-6">
        {!creating && !editing && (
          <Button
            onClick={() => setCreating(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl font-bold shadow-sm h-11 px-5"
          >
            <Plus className="h-4 w-4" /> Novo produto
          </Button>
        )}

        {(creating || editing) && (
          <ProductForm
            product={editing}
            onClose={() => {
              setCreating(false);
              setEditing(null);
            }}
            onSaved={() => {
              setCreating(false);
              setEditing(null);
            }}
          />
        )}
      </div>

      {/* Grid de Todos os Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isAtivo = product.ativo !== false;

          return (
            <div
              key={product.id}
              className={cn("relative", !isAtivo && "opacity-60")}
            >
              <ProductCard
  product={product as any}
  isAdmin={true}
  actions={
    <div className="flex gap-1.5 w-full pt-1">
      {/* Botão Editar: Apenas ícone */}
      <Button
        size="sm"
        variant="secondary"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setEditing(product);
        }}
        className="h-8 w-8 p-0 rounded-md bg-secondary/80 hover:bg-secondary transition-all"
        title="Editar"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>

      {/* Botão Ocultar / Mostrar: Apenas ícone */}
      <Button
        size="sm"
        variant={isAtivo ? "outline" : "default"}
        onClick={(e) => handleToggleActiveClick(e, product)}
        disabled={toggleActiveMutation.isPending}
        className="h-8 flex-1 rounded-md text-xs px-2 flex items-center justify-center gap-1.5"
        title={isAtivo ? "Ocultar" : "Ativar"}
      >
        {isAtivo ? (
          <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <Eye className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">
            {isAtivo ? "Ocultar" : "Ativar"}
        </span>
      </Button>

      {/* Botão Excluir Permanente: Apenas ícone */}
      <Button
        size="sm"
        variant="destructive"
        onClick={(e) => handleHardDeleteClick(e, product)}
        disabled={deleteMutation.isPending}
        className="h-8 w-8 rounded-md p-0 flex items-center justify-center shadow-sm shrink-0"
        title="Excluir"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  }
/>
            </div>
          );
        })}
      </div>
    </div>
  );
}
