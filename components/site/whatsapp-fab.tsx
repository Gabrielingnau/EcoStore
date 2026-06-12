"use client";

import { MessageCircle } from "lucide-react";
import { useStore } from "@/hooks/use-store";
import { unmask } from "@/lib/utils";

export function WhatsAppFab() {
  const { config, isLoading } = useStore();

  // Se estiver carregando ou se o telefone não estiver configurado, não mostra o botão
  if (isLoading || !config?.phone) {
    return null;
  }

  // Limpa o telefone para garantir que esteja apenas em números para o link
  const cleanPhone = unmask(config.phone);

  return (
    <a
      href={`https://wa.me/${cleanPhone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}