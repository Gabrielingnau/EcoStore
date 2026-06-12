"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Criamos o QueryClient dentro de um useState para garantir que a instância
  // seja criada apenas uma vez no ciclo de vida do cliente e não seja compartilhada
  // entre diferentes renderizações ou usuários no servidor.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Define quanto tempo os dados são considerados "frescos" (1 minuto)
            staleTime: 60 * 1000,
            // Evita refetch automático ao focar na janela (opcional, mas bom para dev)
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}