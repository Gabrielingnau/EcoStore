"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getAdminDashboardData } from "../services/admin-service";

export type StatusFilterType = "todos" | "ativos" | "inativos";
export type OrderTabType = "pendentes" | "arquivados";

export function useAdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"produtos" | "pedidos">("produtos");
  
  // Estado para Produtos
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("todos");
  
  // Estados para Pedidos
  const [searchTerm, setSearchTerm] = useState("");
  const [orderTab, setOrderTab] = useState<OrderTabType>("pendentes");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("todos");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-data"],
    queryFn: getAdminDashboardData,
    enabled: !!user && isAdmin,
    refetchInterval: 10000,
    staleTime: 0,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/");
    }
  }, [user, isAdmin, authLoading, router]);

  // Aplica o filtro de produtos na memória
  const filteredProducts = useMemo(() => {
    const allProducts = data?.products ?? [];
    
    if (statusFilter === "ativos") {
      return allProducts.filter((p: any) => p.ativo !== false);
    }
    if (statusFilter === "inativos") {
      return allProducts.filter((p: any) => p.ativo === false);
    }
    
    return allProducts;
  }, [data?.products, statusFilter]);

  // Aplica o filtro e busca de pedidos na memória
  const filteredOrders = useMemo(() => {
    const allOrders = data?.orders ?? [];
    
    // 1. Filtra por Aba (Ativos/Arquivados)
    let list = allOrders.filter((o: any) => 
      orderTab === "pendentes" ? !o.is_archived : o.is_archived
    );

    // 2. Filtra por Status do pedido
    if (orderStatusFilter !== "todos") {
      list = list.filter((o: any) => o.status === orderStatusFilter);
    }
    
    // 3. Filtra por termo de busca (ID, Protocolo ou CPF/Documento)
    if (searchTerm) {
      const term = searchTerm.toLowerCase().replace(/\D/g, ""); // Limpa termo para busca numérica
      list = list.filter((o: any) => 
        o.id.toLowerCase().includes(term) || 
        o.melhor_envio_protocol?.toLowerCase().includes(term) ||
        o.shipping_document?.replace(/\D/g, "").includes(term)
      );
    }
    
    return list;
  }, [data?.orders, searchTerm, orderTab, orderStatusFilter]);

  return {
    tab,
    setTab,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    orderTab,
    setOrderTab,
    orderStatusFilter,
    setOrderStatusFilter,
    products: filteredProducts,
    orders: filteredOrders,
    isInitialLoading: authLoading || isLoading,
    isAdmin,
  };
}