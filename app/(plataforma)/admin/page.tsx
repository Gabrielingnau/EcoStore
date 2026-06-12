"use client";

import { Button } from "@/components/ui/button";
import { ProductsTab } from "./components/products-tab";
import { OrdersTab } from "./components/orders-tab";
import { EmptyState } from "./components/EmptyState";
import { useAdminDashboard, type StatusFilterType } from "./hooks/use-admin-dashboard";

export default function AdminPage() {
  const { 
    tab, 
    setTab, 
    statusFilter,
    setStatusFilter,
    products, 
    orders, 
  } = useAdminDashboard();

  // Filtra os produtos baseado no status selecionado
  const filteredProducts = products.filter((p: any) => {
    if (statusFilter === "ativos") return p.ativo === true;
    if (statusFilter === "inativos") return p.ativo === false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Cabeçalho principal */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Administração</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie o catálogo de produtos, destaques da vitrine e o fluxo de pedidos realizados.
          </p>
        </div>
        <div className="flex gap-2 bg-muted/40 p-1 rounded-xl border border-border/50">
          <Button 
            variant={tab === "produtos" ? "default" : "ghost"} 
            className="rounded-lg font-semibold text-sm px-4"
            onClick={() => setTab("produtos")}
          >
            Produtos
          </Button>
          <Button 
            variant={tab === "pedidos" ? "default" : "ghost"} 
            className="rounded-lg font-semibold text-sm px-4"
            onClick={() => setTab("pedidos")}
          >
            Pedidos
          </Button>
        </div>
      </div>

      {/* Barra de Filtros Específicos para Produtos */}
      {tab === "produtos" && (
        <div className="flex items-center gap-2 border-b border-border/20 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">
            Filtrar por:
          </span>
          {(["todos", "ativos", "inativos"] as StatusFilterType[]).map((type) => (
            <Button
              key={type}
              size="sm"
              variant={statusFilter === type ? "secondary" : "outline"}
              onClick={() => setStatusFilter(type)}
              className="capitalize h-8 rounded-lg font-medium text-xs px-3"
            >
              {type}
            </Button>
          ))}
        </div>
      )}

      {/* Renderização condicional com EmptyState */}
      {tab === "produtos" ? (
        filteredProducts.length > 0 ? (
          <ProductsTab products={filteredProducts} />
        ) : (
          <EmptyState 
            title="Nenhum produto encontrado" 
            description={`Não encontramos produtos com status "${statusFilter}" no momento.`}
            iconType="product"
          />
        )
      ) : (
        orders.length > 0 ? (
          <OrdersTab orders={orders} />
        ) : (
          <EmptyState 
            title="Nenhum pedido realizado" 
            description="Ainda não existem pedidos em sua loja. Fique de olho, assim que eles chegarem aparecerão aqui."
            iconType="order"
          />
        )
      )}
    </div>
  );
}