"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { CheckCircle2, Loader2, MapPin } from "lucide-react";

interface ActivateAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function ActivateAddressModal({ isOpen, onClose, onConfirm, isPending }: ActivateAddressModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md rounded-3xl">
        <AlertDialogHeader className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <AlertDialogTitle className="text-center text-xl">Definir como padrão?</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            Este endereço será usado automaticamente em seus próximos pedidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-2 gap-3 sm:space-x-0">
          <AlertDialogCancel className="rounded-xl font-medium">Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            className="rounded-xl font-bold bg-primary hover:bg-primary/90"
            onClick={(e) => { e.preventDefault(); onConfirm(); }}
            disabled={isPending}
          >
            {isPending ? "Processando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}