import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner"; // Ajustado para manter o padrão semântico de toast do seu app
import { getUserOrders, postRefundRequest } from "../services/profile-service";
import type { OrderWithItems } from "../types/profile-type";

export function useProfile() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getUserOrders(user.id);
      setOrders(data);
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar seus pedidos.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [user, authLoading, router, fetchOrders]);

  const handleRequestRefund = async (orderId: string) => {
    try {
      await postRefundRequest(orderId);
      toast.success("Reembolso solicitado com sucesso!");
      
      // Atualiza o estado local de forma otimista
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, refund_status: "requested" } : o
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Não foi possível solicitar o reembolso.");
    }
  };

  return {
    user,
    orders,
    isInitialLoading: authLoading || loading,
    handleRequestRefund,
  };
}