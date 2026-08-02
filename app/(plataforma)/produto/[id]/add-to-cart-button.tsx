"use client";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import type { CartProduct } from "@/lib/store/types";

export function AddToCartButton({ product }: { product: CartProduct }) {
  const add = useCart((s) => s.add);  
  console.log("AddToCartButton product:", product); // Adicione este log para depuração
  console.log
  return (
    <Button 
      variant="outline"
      size="lg" 
      className="w-full h-12 text-sm font-semibold border-primary/40 text-primary hover:bg-primary/10" 
      disabled={product.estoque <= 0} 
      onClick={() => add(product, 1)}
    >
      <ShoppingBag className="h-4 w-4 mr-2" />
      {product.estoque > 0 ? "Adicionar ao carrinho" : "Esgotado"}
    </Button>
  );
}