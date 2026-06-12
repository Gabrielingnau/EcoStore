import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Imports das camadas separadas
import { getOrder } from "./services/get-order";
import type { SuccessPageProps } from "./types/success-type";

export default async function SuccessPage({ params }: SuccessPageProps) {
  // Resolve o parâmetro da Promise do Next.js
  const resolvedParams = await params;
  const orderId = resolvedParams.orderId;

  // Busca o pedido utilizando o service isolado
  const order = await getOrder(orderId);

  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-6" />
      
      <h1 className="text-3xl font-bold text-foreground tracking-tight">
        Pedido confirmado!
      </h1>
      
      <p className="text-sm text-muted-foreground mt-2 font-medium">
        Pedido #{orderId ? orderId.toString().slice(0, 8) : ""}
      </p>

      {order && (
        <p className="mt-4 text-2xl font-black text-primary tracking-tight drop-shadow-sm">
          {formatBRL(Number(order.total))}
        </p>
      )}

      <div className="mt-10 flex gap-3 justify-center">
        <Link href="/perfil">
          <Button variant="secondary" className="rounded-xl font-semibold">
            Meus pedidos
          </Button>
        </Link>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-smooth">
            Continuar comprando
          </Button>
        </Link>
      </div>
    </div>
  );
}