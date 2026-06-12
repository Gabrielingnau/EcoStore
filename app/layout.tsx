import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { CartDrawer } from "@/components/site/cart-drawer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/auth-provider"; // <--- Adicione este import
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
      <body className="font-sans antialiased">
        <QueryProvider>
          {/* O AuthProvider entra aqui, abraçando o restante do app */}
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
