"use client";

import {
  Archive,
  ArchiveRestore,
  ExternalLink,
  Eye,
  MapPin,
  MessageCircle,
  Package,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { enviarParaCarrinhoMelhorEnvio } from "@/lib/actions/melhor-envio";
import { formatBRL } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

import { useAdminOrders } from "../hooks/use-admin-orders";
import type { OrderWithItems } from "../types/admin-types";

export function OrdersTab({ orders }: { orders: OrderWithItems[] }) {
  const { updateStatus, updateArchive, isStatusPending, isArchivePending } =
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
          updateArchive={updateArchive}
          isStatusPending={isStatusPending}
          isArchivePending={isArchivePending}
        />
      ))}
    </div>
  );
}

function OrderCard({
  order,
  updateStatus,
  updateArchive,
  isStatusPending,
  isArchivePending,
}: any) {
  const isPickup = order.shipping_type === "retirada";
  const isLocal = order.shipping_type === "entrega_propria";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shippingStyles = isPickup
    ? "border-purple-500/50 bg-purple-500/5"
    : isLocal
      ? "border-emerald-500/50 bg-emerald-500/5"
      : "border-border";

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
          document: order.shipping_document,
        },
        items: order.order_items,
        orderId: order.id,
      }),
    onSuccess: () => toast.success("Pedido enviado para o Melhor Envio!"),
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <Card
      className={`flex flex-col overflow-hidden border transition-all hover:shadow-md ${shippingStyles}`}
    >
      <div className="border-b border-border/50 bg-muted/20 p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold tracking-tight">
                #{order.id.slice(0, 8)}
              </span>
              <Badge
                className={`text-[8px] uppercase ${isPickup ? "bg-purple-600 text-white" : isLocal ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"}`}
              >
                {isPickup
                  ? "Retirada"
                  : isLocal
                    ? "Entrega Própria"
                    : "Melhor Envio"}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-bold text-primary">
              {formatBRL(Number(order.total))}
            </p>
            <div className="flex flex-wrap gap-1 justify-end">
              <Badge className="text-[9px]">{order.payment_status}</Badge>
              <Badge className="text-[9px] bg-primary/10 text-primary">
                {order.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor={`order-status-${order.id}`} className="sr-only">
            Status do pedido #{order.id.slice(0, 8)}
          </label>
          <Select
            value={order.status}
            onValueChange={(val) => updateStatus({ id: order.id, status: val })}
            disabled={isStatusPending}
          >
            <SelectTrigger id={`order-status-${order.id}`} className="w-full h-8 text-xs" aria-label={`Status do pedido #${order.id.slice(0, 8)}`}>
              <SelectValue>{order.status}</SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[220px]">
              <SelectItem value="Em Preparação">Em Preparação</SelectItem>
              <SelectItem value="pronto_para_retirada">
                Pronto p/ Retirada
              </SelectItem>
              <SelectItem value="preparando_entrega">
                Preparando Entrega
              </SelectItem>
              <SelectItem value="Etiqueta Paga">Etiqueta Paga</SelectItem>
              <SelectItem value="Postado">Postado</SelectItem>
              <SelectItem value="Entregue">Entregue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardContent className="flex-1 p-4 space-y-4 text-[11px]">
        <div className="rounded-lg bg-muted/40 p-3 space-y-2 border border-border/50">
          <div className="font-bold flex items-center gap-2">
            {isPickup ? <MapPin size={12} /> : <User size={12} />}
            {isPickup ? "Local de Retirada" : "Cliente"}
          </div>
          <p className="font-medium">
            {order.shipping_name} ({order.shipping_document})
          </p>

          {!isPickup && (
            <p className="text-muted-foreground leading-tight">
              {order.shipping_address}, {order.shipping_city} -{" "}
              {order.shipping_state}
            </p>
          )}

          <div className="pt-2 border-t border-border/20 font-bold space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Truck size={12} /> Serviço:
              </span>{" "}
              {order.shipping_company_name || "N/A"}
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">Frete:</span>{" "}
              {formatBRL(Number(order.shipping_cost || 0))}
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">Peso:</span>{" "}
              {order.total_weight}kg
            </div>
          </div>
        </div>

        {order.tracking_code && order.tracking_code !== "Não rastreável" && (
          <a
            href={`https://www.melhorrastreio.com.br/rastreio/${order.tracking_code}`}
            target="_blank"
            rel="noreferrer"
            className="block bg-blue-50 p-2 rounded border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            <p className="font-bold text-blue-800 flex justify-between items-center">
              Rastreio: {order.tracking_code} <ExternalLink size={10} />
            </p>
          </a>
        )}

        {/* Botão que aciona o Modal de Produtos detalhados */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs flex items-center justify-center gap-2"
              >
                <Package size={14} /> Ver Produtos ({order.order_items.length}){" "}
                <Eye size={12} className="ml-auto text-muted-foreground" />
              </Button>
            }
          ></DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Package size={16} /> Itens do Pedido #{order.id.slice(0, 8)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              {order.order_items.map((i: any) => (
                <div
                  key={i.id}
                  className="flex items-center gap-3 p-2 rounded-lg border border-border/60 bg-muted/20"
                >
                  {/* Foto do produto/variante */}
                  {i.product_image ? (
                    <img
                      src={i.product_image}
                      alt={i.product_name}
                      className="w-14 h-14 object-cover rounded-md border border-border shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-muted rounded-md border border-border flex items-center justify-center shrink-0 text-[10px] text-muted-foreground">
                      Sem foto
                    </div>
                  )}

                  {/* Informações detalhadas */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate">
                      {i.product_name}
                    </p>
                    <div className="flex flex-wrap gap-1 my-1">
                      {i.cor && (
                        <Badge className="text-[9px]">Cor: {i.cor}</Badge>
                      )}
                      {i.tamanho && (
                        <Badge className="text-[9px]">Tam: {i.tamanho}</Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Qtd: {i.quantity}x
                    </p>
                  </div>

                  {/* Preço */}
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-primary">
                      {formatBRL(Number(i.unit_price) * i.quantity)}
                    </p>
                    {i.quantity > 1 && (
                      <p className="text-[9px] text-muted-foreground">
                        ({formatBRL(Number(i.unit_price))} un)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex justify-between pt-2 border-t border-border gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-[10px]"
            onClick={() =>
              updateArchive({ id: order.id, is_archived: !order.is_archived })
            }
            disabled={isArchivePending}
          >
            {order.is_archived ? (
              <ArchiveRestore size={14} className="mr-1" />
            ) : (
              <Archive size={14} className="mr-1" />
            )}
            {order.is_archived ? "Desarquivar" : "Arquivar"}
          </Button>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${order.shipping_phone?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="sm" variant="outline" className="h-8 text-[10px]">
                <MessageCircle size={14} className="mr-1" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}