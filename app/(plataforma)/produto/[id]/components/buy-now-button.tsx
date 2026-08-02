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
    add(product, 1);
    router.push("/checkout");
  };

  return (
    <Button 
      onClick={handleBuyNow}
      disabled={product.estoque <= 0 || loading}
      className="w-full h-12 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
    >
      {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Comprar agora"}
    </Button>
  );
}