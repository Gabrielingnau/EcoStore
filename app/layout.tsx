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
  metadataBase: new URL("https://eco-store-tan.vercel.app"),

  title: {
    default: "EcoStore — Moda Autêntica e Acessórios Premium",
    template: "%s | EcoStore",
  },

  description:
    "Descubra roupas e acessórios de alta qualidade com design autêntico. Vista seu estilo com sofisticação, conforto e entrega rápida.",

  keywords: [
    "moda autêntica",
    "roupas premium",
    "acessórios",
    "EcoStore",
    "moda sustentável",
    "tendências de estilo",
  ],

  authors: [{ name: "EcoStore" }],
  creator: "EcoStore",
  publisher: "EcoStore",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://eco-store-tan.vercel.app",
    siteName: "EcoStore",
    title: "EcoStore — Moda Autêntica e Acessórios Premium",
    description:
      "Renove seu guarda-roupa com peças exclusivas, alta qualidade e estilo autêntico. Confira as novidades!",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EcoStore - Moda Autêntica e Acessórios",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "EcoStore — Moda Autêntica",
    description:
      "Roupas e acessórios premium para quem valoriza estilo e autenticidade.",
    images: ["/og-image.jpg"],
  },

  // Ícones (Opcional, caso queira garantir favicon futuramente)
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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