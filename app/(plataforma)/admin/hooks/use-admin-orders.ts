"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  updateOrderStatusService, 
  updateRefundStatusService,
} from "../services/admin-service";
import { syncOrderTracking } from "@/lib/actions/tracking"; // Importando a Action
import { enviarParaCarrinhoMelhorEnvio } from "@/lib/actions/melhor-envio"; // Importando a Action

export function useAdminOrders() {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateOrderStatusService(id, status),
    onSuccess: () => {
      toast.success("Status do pedido atualizado.");
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const refundMutation = useMutation({
    mutationFn: ({ id, refundStatus }: { id: string; refundStatus: string }) => 
      updateRefundStatusService(id, refundStatus),
    onSuccess: () => {
      toast.success("Status do reembolso processado.");
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Nova mutação de Rastreio
  const trackingMutation = useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) => syncOrderTracking(id, code),
    onSuccess: () => {
      toast.success("Rastreio atualizado!");
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Nova mutação de Reenvio
  const retryMutation = useMutation({
    mutationFn: (order: any) => enviarParaCarrinhoMelhorEnvio(order),
    onSuccess: () => {
      toast.success("Pedido enviado para o Melhor Envio!");
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return {
    updateStatus: statusMutation.mutate,
    updateRefund: refundMutation.mutate,
    updateTracking: trackingMutation.mutate,
    retryOrder: retryMutation.mutate,
    isStatusPending: statusMutation.isPending,
    isRefundPending: refundMutation.isPending,
    isTrackingPending: trackingMutation.isPending,
    isRetryPending: retryMutation.isPending,
  };
}