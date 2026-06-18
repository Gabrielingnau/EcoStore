"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabase/client";
import { 
  updateOrderStatusService, 
  updateRefundStatusService,
} from "../services/admin-service";
import { enviarParaCarrinhoMelhorEnvio } from "@/lib/actions/melhor-envio";

export function useAdminOrders() {
  const queryClient = useQueryClient();
  const supabase = supabaseBrowser();

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

  const archiveMutation = useMutation({
    mutationFn: async ({ id, is_archived }: { id: string; is_archived: boolean | null }) => {
      const { error } = await (supabase.from("orders") as any)
        .update({ is_archived })
        .eq("id", id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Pedido atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

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
    updateArchive: archiveMutation.mutate,
    retryOrder: retryMutation.mutate,
    isStatusPending: statusMutation.isPending,
    isRefundPending: refundMutation.isPending,
    isArchivePending: archiveMutation.isPending,
    isRetryPending: retryMutation.isPending,
  };
}