"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { Card, CardContent } from "@/components/ui/card";

function SuccessContent() {
  const searchParams = useSearchParams();
  
  const clearCart = useCart((state) => state.clear);

  // Limpa o carrinho ao carregar a página de sucesso
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card className="border-none shadow-xl bg-gradient-to-b from-card to-muted/20">
        <CardContent className="pt-10 pb-8 text-center flex flex-col items-center">
          <div className="h-20 w-20 bg-primary/15 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Pagamento Confirmado!
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Seu pedido foi processado e já estamos preparando tudo por aqui.
          </p>

          <div className="mt-8 space-y-3 w-full">
            <Link href="/perfil" className="block">
              <Button className="w-full h-12 rounded-xl font-bold text-base shadow-sm" size="lg">
                Ver meus pedidos
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}