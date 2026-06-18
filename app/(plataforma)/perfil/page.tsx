"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";
import { useProfile } from "./hooks/use-profile";
import { BackButton } from "@/components/site/back-button";
import { Package, Truck, MapPin, CalendarDays, ReceiptText, ExternalLink } from "lucide-react";

export default function ProfilePage() {
  const { user, orders } = useProfile();

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <BackButton />
      
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Meu perfil</h1>
        <p className="text-muted-foreground font-medium">{user?.email}</p>
      </div>

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
                    <Badge className="rounded-md uppercase tracking-wider font-semibold text-[10px] px-3 py-1 bg-primary/10 text-primary">
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6 space-y-6">
                  {/* Produtos */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Produtos</h4>
                    {order.order_items.map((it) => (
                      <div key={it.id} className="flex gap-4 items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted border">
                          <Image src={it.product_image || "/placeholder.png"} alt={it.product_name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{it.product_name}</p>
                          <p className="text-xs text-muted-foreground">{it.quantity}x {formatBRL(Number(it.unit_price))}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                    {/* Logística */}
<div className="space-y-3">
  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
    <Truck className="h-4 w-4 text-primary" /> Informações de Entrega
  </div>
  <div className="bg-muted/40 p-3 rounded-lg text-xs text-muted-foreground space-y-2 border border-border/50">
    {/* Identificação do tipo de entrega */}
    <p className="font-bold text-foreground">
      {order.shipping_type === 'retirada' 
        ? "Retirada na Loja" 
        : order.shipping_type === 'entrega_propria' 
          ? "Entrega Própria da Loja" 
          : "Envio por Transportadora"}
    </p>

    {/* Endereço ou Local de Retirada */}
    {order.shipping_type !== 'retirada' && (
      <p className="flex items-start gap-2">
        <MapPin className="h-3.5 w-3.5 mt-0.5" /> 
        {order.shipping_address}, {order.shipping_city}
      </p>
    )}

    {/* Lógica de Rastreio/Status */}
    {order.shipping_type === 'melhor_envio' ? (
      order.tracking_code ? (
        <a 
          href={`https://www.melhorrastreio.com.br/rastreio/${order.tracking_code}`} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-1 text-primary font-bold hover:underline"
        >
          Rastrear: {order.tracking_code} <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <p className="font-semibold text-amber-600">Aguardando código de rastreio</p>
      )
    ) : (
      <p className="font-semibold text-primary">
        {order.shipping_type === 'retirada' 
          ? "Pode buscar seu pedido na loja!" 
          : "Nossa equipe está separando seu pedido para entrega."}
      </p>
    )}
  </div>
</div>

                    {/* Valores */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <ReceiptText className="h-4 w-4 text-primary" /> Resumo Financeiro
                      </div>
                      <div className="space-y-2 p-3 bg-card border rounded-lg">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Subtotal</span>
                          <span>{formatBRL(Number(order.total) - Number(order.shipping_cost || 0))}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Frete</span>
                          <span>{formatBRL(Number(order.shipping_cost || 0))}</span>
                        </div>
                        <div className="flex justify-between text-base font-black text-foreground pt-2 border-t border-border">
                          <span>Total</span>
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