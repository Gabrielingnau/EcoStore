"use client";

import { Loader2, Mail, MessageCircle, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { enviarParaCarrinhoMelhorEnvio } from "@/lib/actions/melhor-envio"; // Importe conforme sua estrutura
import { syncOrderTracking } from "@/lib/actions/tracking";
import { formatBRL } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAdminOrders } from "../hooks/use-admin-orders";
import type { OrderWithItems } from "../types/admin-types";

export function OrdersTab({ orders }: { orders: OrderWithItems[] }) {
  const { updateStatus, updateRefund, isStatusPending, isRefundPending } =
    useAdminOrders();

  if (orders.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        Nenhum pedido encontrado.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          updateStatus={updateStatus}
          updateRefund={updateRefund}
          isStatusPending={isStatusPending}
          isRefundPending={isRefundPending}
        />
      ))}
    </div>
  );
}

function OrderCard({
  order,
  updateStatus,
  updateRefund,
  isStatusPending,
  isRefundPending,
}: any) {
  const queryClient = useQueryClient();

  // Mutação para atualizar rastreio
  const trackingMutation = useMutation({
    mutationFn: () => syncOrderTracking(order.id, order.tracking_code),
    onSuccess: () => {
      toast.success("Rastreio atualizado!");
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Mutação para reenviar pedido (caso esteja pendente)
  const retryMutation = useMutation({
    mutationFn: () =>
      enviarParaCarrinhoMelhorEnvio({
        shipping: {
          id: order.shipping_service_id,
          name: order.shipping_name,
          address: order.shipping_address,
          city: order.shipping_city,
          zip: order.shipping_zip,
          phone: order.shipping_phone,
          email: order.shipping_email,
          document: order.shipping_document, // Certifique-se que esse campo existe no seu BD
        },
        items: order.order_items,
        orderId: order.id,
      }),
    onSuccess: () => {
      toast.success("Pedido enviado para o Melhor Envio!");
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const statusLabels: Record<string, string> = {
    paid: "Pago",
    preparing: "Em Preparação",
    shipped: "A Caminho",
    delivered: "Entregue",
    pending: "Pendente",
  };

  return (
    <Card className="flex flex-col overflow-hidden border-border transition-all hover:shadow-md">
      <div className="border-b border-border/50 bg-muted/20 p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              #{order.id.slice(0, 8)}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-primary">
              {formatBRL(Number(order.total))}
            </p>
            <Badge className="mt-1 rounded-sm text-[10px] uppercase bg-primary/10 text-primary hover:bg-primary/20">
              {statusLabels[order.status] || order.status}
            </Badge>
          </div>
        </div>

        <Select
          value={order.status}
          onValueChange={(val: string) =>
            updateStatus({ id: order.id, status: val })
          }
          disabled={isStatusPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="preparing">Em Preparação</SelectItem>
            <SelectItem value="shipped">A Caminho</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CardContent className="flex-1 p-4 space-y-4">
        {/* Bloco de Rastreio */}
        {order.tracking_code && (
          <div className="bg-blue-50 p-2 rounded text-[11px] border border-blue-100">
            <p className="font-bold text-blue-800">
              Rastreio: {order.tracking_code}
            </p>
            <p className="text-blue-600 truncate">
              {order.last_tracking_event || "Aguardando atualização"}
            </p>
          </div>
        )}

        {/* Botões de Ação Logística */}
        <div className="flex gap-2">
          {order.status === "integracao_pendente" && (
            <Button
              size="sm"
              onClick={() => retryMutation.mutate()}
              disabled={retryMutation.isPending}
              className="w-full h-8 text-xs"
            >
              {retryMutation.isPending ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Reenviar
            </Button>
          )}
          {order.tracking_code && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => trackingMutation.mutate()}
              disabled={trackingMutation.isPending}
              className="h-8"
            >
              {trackingMutation.isPending ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        <Accordion className="w-full">
          <AccordionItem value="items" className="border-none">
            <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
              Produtos ({order.order_items.length})
            </AccordionTrigger>
            <AccordionContent className="max-h-[150px] overflow-y-auto space-y-2 pr-1">
              {order.order_items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between text-xs border-b border-border/50 pb-1"
                >
                  <span>
                    {item.quantity}x {item.product_name}
                  </span>
                  <span className="font-medium">
                    {formatBRL(Number(item.unit_price))}
                  </span>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="rounded-md bg-muted/40 p-3 text-[11px] space-y-1">
          <p className="font-semibold">{order.shipping_name}</p>
          <p className="text-muted-foreground">
            {order.shipping_address}, {order.shipping_city}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {order.refund_status === "requested" && (
            <Button
              size="sm"
              className="w-full h-8 text-xs bg-emerald-600"
              onClick={() =>
                updateRefund({ id: order.id, refundStatus: "approved" })
              }
              disabled={isRefundPending}
            >
              Aprovar Reembolso
            </Button>
          )}
          <div className="flex justify-end gap-2">
            {order.shipping_phone && (
              <a
                href={`https://wa.me/${order.shipping_phone.replace(/\D/g, "")}?text=Olá, ${order.shipping_name.split(" ")[0]}! Sobre o pedido #${order.id.slice(0, 8)}...`}
                target="_blank"
                rel="noreferrer"
              >
                <Button size="sm" variant="outline" className="h-8 text-[10px]">
                  <MessageCircle size={14} className="mr-1" /> WhatsApp
                </Button>
              </a>
            )}
            <a href={`mailto:${order.shipping_email}`}>
              <Button size="sm" variant="outline" className="h-8 text-[10px]">
                <Mail size={14} />
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
