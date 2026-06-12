"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";
import { useProfile } from "./hooks/use-profile";
import { BackButton } from "@/components/site/back-button";
import { Package, Truck, MapPin, CalendarDays, ReceiptText } from "lucide-react";

export default function ProfilePage() {
  const { user, orders } = useProfile();

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <BackButton />
      
      {/* Cabeçalho do Perfil */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Meu perfil</h1>
        <p className="text-muted-foreground font-medium">{user?.email}</p>
      </div>

      {/* Seção de Pedidos */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Meus pedidos</h2>
        
        {orders.length === 0 ? (
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="py-12 text-center text-muted-foreground font-medium text-sm">
              Você ainda não fez nenhum pedido.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-0.5">
                      <CardTitle className="text-lg">Pedido #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(order.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge className="rounded-md uppercase tracking-wider font-semibold text-[10px] px-2.5 py-0.5">
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6 space-y-6">
                  {/* Lista de Produtos */}
                  <div className="space-y-4">
                    {order.order_items.map((it) => (
                      <div key={it.id} className="flex gap-4 items-center">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
                          <Image src={it.product_image || "/placeholder.png"} alt={it.product_name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{it.product_name}</p>
                          <p className="text-xs text-muted-foreground font-medium">{it.quantity}× {formatBRL(Number(it.unit_price))}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="border-border" />

                  {/* Informações de Envio e Totais */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Truck className="h-4 w-4 text-primary" /> Informações de Entrega
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p className="flex items-start gap-1"><MapPin className="h-3 w-3 mt-0.5" /> {order.shipping_address}, {order.shipping_city}</p>
                        <p>CEP: {order.shipping_zip}</p>
                        {order.tracking_code && (
                          <p className="font-mono text-primary font-bold mt-2">Rastreio: {order.tracking_code}</p>
                        )}
                        {order.last_tracking_event && (
                          <p className="italic text-[10px]">Status: {order.last_tracking_event}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <ReceiptText className="h-4 w-4 text-primary" /> Valores
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Frete:</span>
                          <span>{formatBRL(Number(order.shipping_cost || 0))}</span>
                        </div>
                        <div className="flex justify-between text-base font-black text-foreground pt-2">
                          <span>Total:</span>
                          <span className="text-primary">{formatBRL(Number(order.total))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}