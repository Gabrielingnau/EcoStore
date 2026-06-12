"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cart";
import { formatBRL } from "@/lib/utils";

export function CartDrawer() {
  const router = useRouter();
  const { items, open, setOpen, updateQty, remove } = useCart();
  const subtotal = items.reduce((acc, i) => acc + i.product.preco * i.quantity, 0);
  const totalQty = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card border-l border-border flex flex-col shadow-lg"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground">Sacola</h2>
                <p className="text-sm text-muted-foreground">{totalQty} {totalQty === 1 ? "item" : "itens"}</p>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="h-10 w-10 rounded-lg hover:bg-accent text-foreground flex items-center justify-center transition-smooth" 
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-20">
                  <p className="text-lg font-medium text-foreground mb-2">Sua sacola está vazia</p>
                  <p className="text-sm">Adicione produtos para continuar</p>
                </div>
              ) : (
                items.map((item) => {
                  const estoqueDisponivel = item.product.estoque ?? 0;
                  const atingiuLimite = item.quantity >= estoqueDisponivel;

                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-3 rounded-xl bg-secondary"
                    >
                      <div className="relative h-24 w-20 rounded-lg overflow-hidden bg-muted">
                        <Image src={item.product.imagem_url} alt={item.product.nome} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-sm text-foreground truncate">{item.product.nome}</h3>
                          <p className="text-primary font-bold mt-1">{formatBRL(item.product.preco)}</p>
                          
                          {atingiuLimite && (
                            <span className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1 animate-pulse">
                              <AlertCircle className="h-3 w-3" /> Limite atingido
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-background border border-border rounded-lg p-1">
                            <button 
                              onClick={() => updateQty(item.product.id, item.quantity - 1)} 
                              className="h-7 w-7 rounded-md hover:bg-accent flex items-center justify-center text-foreground"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                            <button 
                              onClick={() => updateQty(item.product.id, item.quantity + 1)} 
                              disabled={atingiuLimite}
                              className="h-7 w-7 rounded-md hover:bg-accent flex items-center justify-center text-foreground disabled:opacity-30"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button 
                            onClick={() => remove(item.product.id)} 
                            className="h-8 w-8 rounded-lg hover:bg-destructive/20 hover:text-destructive text-muted-foreground transition-smooth flex items-center justify-center" 
                            aria-label="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <footer className="p-6 border-t border-border space-y-4 bg-card">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Quantidade</span>
                    <span>{totalQty} {totalQty === 1 ? "item" : "itens"}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-lg text-foreground">Total</span>
                    <span className="font-bold text-2xl text-primary">{formatBRL(subtotal)}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setOpen(false); router.push("/checkout"); }}
                  className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-smooth"
                >
                  Finalizar compra
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}