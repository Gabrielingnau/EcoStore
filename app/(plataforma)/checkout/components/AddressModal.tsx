"use client";

import { Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ActivateAddressModal } from "../../endereco/components/ActivateAddressModal";

export function AddressModal({
  addresses,
  currentId,
  onSelect,
  onActivate,
  isPending,
}: any) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <>
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Trocar</Button>}
        ></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Selecione um endereço</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {addresses.map((addr: any) => (
              <div
                key={addr.id}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer flex justify-between items-center transition-all",
                  currentId === addr.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <div className="flex-1" onClick={() => onSelect(addr.id)}>
                  <p className="font-medium text-sm">
                    {addr.street}, {addr.city}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {addr.zip_code}
                  </p>
                </div>

                {/* Botão para ativar se não for o atual */}
                {currentId !== addr.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveId(addr.id)}
                  >
                    Ativar
                  </Button>
                )}

                {currentId === addr.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full mt-2"
              onClick={() => router.push("/endereco")}
            >
              <Plus className="w-4 h-4 mr-2" /> Gerenciar endereços
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reutilizando seu modal de confirmação */}
      <ActivateAddressModal
        isOpen={!!activeId}
        onClose={() => setActiveId(null)}
        onConfirm={() => {
          onActivate(activeId);
          setActiveId(null);
        }}
        isPending={isPending}
      />
    </>
  );
}
