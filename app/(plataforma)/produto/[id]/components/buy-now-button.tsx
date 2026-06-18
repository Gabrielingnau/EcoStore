"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function BuyNowButton({ product }: { product: any }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const [loading, setLoading] = useState(false);

  const handleBuyNow = () => {
    setLoading(true);
    // 1. Adiciona ao carrinho
    add(product, 1);
    // 2. Redireciona para o checkout
    router.push("/checkout");
  };

  return (
    <Button 
      onClick={handleBuyNow}
      disabled={product.estoque <= 0 || loading}
      className="w-full h-12 text-base font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Comprar agora"}
    </Button>
  );
}