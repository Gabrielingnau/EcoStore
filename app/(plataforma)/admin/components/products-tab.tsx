"use client";

import { Eye, EyeOff, Pencil, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteProductService,
  toggleProductActiveService,
} from "../services/admin-service";

import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { revalidateProductFull, revalidateProductById, revalidateProductsList } from "@/lib/actions/revalidate";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ProductRow } from "../types/admin-types";
import { ProductForm } from "./product-form";

type ProductWithAtivo = ProductRow & { ativo?: boolean };

interface ProductsTabProps {
  products: ProductWithAtivo[];
}

export function ProductsTab({ products }: ProductsTabProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [creating, setCreating] = useState(false);
  
  const [productToDelete, setProductToDelete] = useState<ProductWithAtivo | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProductService(id),
    onSuccess: async (_, id) => {
      await revalidateProductFull(id);
      toast.success("Produto removido definitivamente do catálogo.");
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
      setProductToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Erro ao excluir produto.");
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({
      id,
      currentStatus,
    }: {
      id: string;
      currentStatus: boolean;
    }) => toggleProductActiveService(id, currentStatus),
    onSuccess: async (_, variables) => {
      await Promise.all([
        revalidateProductById(variables.id),
        revalidateProductsList()
      ]);
      toast.success(
        variables.currentStatus
          ? "Produto desativado e ocultado da vitrine."
          : "Produto reativado na vitrine!",
      );
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleOpenDeleteModal = (
    e: React.MouseEvent,
    product: ProductWithAtivo,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setProductToDelete(product);
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
      <div className="space-y-6">
        {!creating && !editing && (
          <Button
            onClick={() => setCreating(true)}
            className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl font-bold shadow-sm h-11 px-5"
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
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setEditing(product);
                      }}
                      className="h-8 w-8 p-0 rounded-md bg-secondary/80 hover:bg-secondary transition-all"
                      aria-label={`Editar ${product.nome}`}
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      variant={isAtivo ? "outline" : "default"}
                      onClick={(e) => handleToggleActiveClick(e, product)}
                      disabled={toggleActiveMutation.isPending}
                      className={`h-8 flex-1 rounded-md text-xs px-2 flex items-center justify-center gap-1.5 ${!isAtivo ? "text-white" : ""}`}
                      aria-label={isAtivo ? `Ocultar ${product.nome}` : `Ativar ${product.nome}`}
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

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => handleOpenDeleteModal(e, product)}
                      className="h-8 w-8 rounded-md p-0 flex items-center justify-center shadow-sm shrink-0 text-white"
                      aria-label={`Excluir ${product.nome}`}
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

      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              Excluir produto definitivamente?
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground space-y-2">
              <span>
                Você está prestes a apagar permanentemente o item{" "}
                <strong className="text-foreground font-semibold">
                  "{productToDelete?.nome}"
                </strong>
                . Esta ação não poderá ser desfeita.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1 my-2 border">
            <p>• O produto será removido da vitrine e do painel.</p>
            <p>• O histórico de pedidos antigos será preservado com segurança.</p>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setProductToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1 rounded-xl font-semibold text-white"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (productToDelete) {
                  deleteMutation.mutate(productToDelete.id);
                }
              }}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Sim, excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}