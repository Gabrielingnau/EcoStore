"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    searchTerm,
    setSearchTerm,
    orderTab,
    setOrderTab,
    orderStatusFilter,
    setOrderStatusFilter
  } = useAdminDashboard();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "pedidos" || hash === "produtos") {
      setTab(hash as "produtos" | "pedidos");
    }
  }, [setTab]);

  const handleTabChange = (newTab: "produtos" | "pedidos") => {
    setTab(newTab);
    window.location.hash = newTab;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Administração</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie o catálogo de produtos e o fluxo de pedidos.
          </p>
        </div>
        <div className="flex gap-2 bg-muted/40 p-1 rounded-xl border border-border/50">
          <Button 
            variant={tab === "produtos" ? "default" : "ghost"} 
            className="rounded-lg font-semibold text-sm px-4"
            onClick={() => handleTabChange("produtos")}
          >
            Produtos
          </Button>
          <Button 
            variant={tab === "pedidos" ? "default" : "ghost"} 
            className="rounded-lg font-semibold text-sm px-4"
            onClick={() => handleTabChange("pedidos")}
          >
            Pedidos
          </Button>
        </div>
      </div>

      {/* FILTROS E PESQUISA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
        {tab === "produtos" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-muted-foreground mr-2">Status:</span>
            {(["todos", "ativos", "inativos"] as StatusFilterType[]).map((type) => (
              <Button
                key={type}
                size="sm"
                variant={statusFilter === type ? "secondary" : "outline"}
                onClick={() => setStatusFilter(type)}
                className="capitalize h-8 rounded-lg text-xs"
              >
                {type}
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-wrap gap-2 w-full">
              <Input 
                placeholder="Buscar por ID, Protocolo ou CPF..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:max-w-xs rounded-xl h-9 text-sm"
              />
              
              <select 
                className="h-9 px-3 rounded-xl border border-input bg-background text-xs"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="todos">Todos os Status</option>
                <option value="Em Preparação">Em Preparação</option>
                <option value="pronto_para_retirada">Pronto p/ Retirada</option>
                <option value="preparando_entrega">Preparando Entrega</option>
                <option value="Etiqueta Paga">Etiqueta Paga</option>
                <option value="Postado">Postado</option>
                <option value="Entregue">Entregue</option>
              </select>
            </div>

            <div className="flex gap-1 bg-muted/40 p-0.5 rounded-lg border border-border w-fit">
              <Button size="sm" variant={orderTab === "pendentes" ? "default" : "ghost"} onClick={() => setOrderTab("pendentes")} className="h-8 rounded-md text-xs">Ativos</Button>
              <Button size="sm" variant={orderTab === "arquivados" ? "default" : "ghost"} onClick={() => setOrderTab("arquivados")} className="h-8 rounded-md text-xs">Arquivados</Button>
            </div>
          </div>
        )}
      </div>

      {/* Renderização */}
      {tab === "produtos" ? (
        products.length > 0 ? (
          <ProductsTab products={products} />
        ) : (
          <EmptyState title="Nenhum produto encontrado" iconType="product" />
        )
      ) : (
        orders.length > 0 ? (
          <OrdersTab orders={orders} />
        ) : (
          <EmptyState 
            title="Nenhum pedido encontrado" 
            description="Tente ajustar os filtros ou termo de busca."
            iconType="order"
          />
        )
      )}
    </div>
  );
}