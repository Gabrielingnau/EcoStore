"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getAdminDashboardData } from "../services/admin-service";

export type StatusFilterType = "todos" | "ativos" | "inativos";

export function useAdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"produtos" | "pedidos">("produtos");
  
  // Novo estado para controlar o filtro do Admin
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("todos");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-data"],
    queryFn: getAdminDashboardData,
    enabled: !!user && isAdmin,
    refetchOnWindowFocus: true,
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

  // Aplica o filtro de forma performática na memória
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

  return {
    tab,
    setTab,
    statusFilter,
    setStatusFilter,
    products: filteredProducts, // Retorna os produtos já filtrados pelo estado
    orders: data?.orders ?? [],
    isInitialLoading: authLoading || isLoading,
    isAdmin,
  };
}