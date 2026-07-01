"use client";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import type { ProductDatabase } from "./types/product-type";

export function AddToCartButton({ product }: { product: ProductDatabase }) {
  console.log(product, "PRODUCT");
  const add = useCart((s) => s.add);
  return (
    <Button size="lg" className="w-full" disabled={product.estoque <= 0} onClick={() => add(product, 1)}>
      <ShoppingBag className="h-5 w-5" />
      {product.estoque > 0 ? "Adicionar à sacola" : "Esgotado"}
    </Button>
  );
}
