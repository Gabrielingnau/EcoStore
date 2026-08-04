import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { CartDrawer } from "@/components/site/cart-drawer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";

import "./styles/globals.css";
import { StoreProvider } from "@/providers/store-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "EcoStore — Moda autêntica",
  description: "Loja de roupas e acessórios premium",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={cn("dark", inter.variable)}>
      <head>
        {/* Otimização de LCP: Conecta antecipadamente ao Supabase para carregar imagens e dados mais rápido */}
        <link rel="preconnect" href="https://trmbmnjpylozykcyxcuc.supabase.co" />
        <link rel="dns-prefetch" href="https://trmbmnjpylozykcyxcuc.supabase.co" />
      </head>
      <body className="font-sans antialiased">
        <QueryProvider>
          <AuthProvider>
            <StoreProvider>
              <main className="min-h-[calc(100vh-80px)]">{children}</main>
              <CartDrawer />
              <WhatsAppFab />
              <Toaster richColors position="bottom-right" closeButton />
            </StoreProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}