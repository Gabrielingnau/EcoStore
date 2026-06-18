"use client";

import { use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { Card, CardContent } from "@/components/ui/card";

// Ajustamos o tipo para receber a Promise
export default function SuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  // Desempacotamos o params usando o React.use()
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  
  const clearCart = useCart((state) => state.clear);

  // Limpa o carrinho ao carregar a página de sucesso
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto">
      <Card className="border-none shadow-xl bg-gradient-to-b from-card to-muted/20">
        <CardContent className="pt-10 pb-8 text-center flex flex-col items-center">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Tudo certo!
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Seu pedido foi confirmado com sucesso.
          </p>
          
          <div className="mt-6 p-4 bg-background border rounded-2xl w-full flex justify-between items-center">
            <span className="text-sm font-semibold text-muted-foreground">Número do pedido:</span>
            <span className="font-mono font-bold text-foreground">#{orderId.slice(0, 8).toUpperCase()}</span>
          </div>

          <div className="mt-8 space-y-3 w-full">
            <Link href="/perfil" className="block">
              <Button className="w-full h-12 rounded-xl font-bold text-base" size="lg">
                Ver detalhes do pedido
              </Button>
            </Link>
            
            <Link href="/" className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2">
              <ShoppingBag className="h-4 w-4" /> Continuar comprando <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}