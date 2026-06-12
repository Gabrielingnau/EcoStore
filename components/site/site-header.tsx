"use client";
import Link from "next/link";
import { ShoppingBag, User as UserIcon, Shield, LogOut, Phone, MapPin, Settings } from "lucide-react"; 
import { useCart, useCartCount } from "@/lib/store/cart";
import { useAuth } from "@/hooks/use-auth";
import { useStore } from "@/hooks/use-store"; // Import do seu hook de loja
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function SiteHeader() {
  const setOpen = useCart((s) => s.setOpen);
  const count = useCartCount();
  const { user, isAdmin, loading } = useAuth();
  const { config } = useStore(); // Acessando dados globais da loja
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    const supabase = supabaseBrowser() as any;
    await supabase.auth.signOut();
    queryClient.clear();
    toast.success("Sessão encerrada");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="px-2 md:px-4 lg:px-10 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary shadow-glow flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-lg">
              {config?.name.charAt(0) || "I"}
            </span>
          </div>
          {/* Nome da loja dinâmico vindo do useStore */}
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            {config?.name || "Loja"}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/contato" className="h-10 w-10 sm:w-auto sm:px-4 rounded-xl hover:bg-secondary transition-smooth flex items-center justify-center gap-2 font-medium text-sm">
            <Phone className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Contato</span>
          </Link>

          {loading ? (
            <div className="h-10 w-10 rounded-xl bg-secondary/50 animate-pulse" />
          ) : (
            <>
              {isAdmin && (
                <>
                  {/* Ícone de Engrenagem (Configurações) apenas para Admin */}
                  <Link 
                    href="/configuracoes" 
                    className={`h-10 w-10 rounded-xl transition-smooth flex items-center justify-center ${
                      pathname === "/admin/configuracoes" ? "bg-accent" : "hover:bg-accent"
                    }`}
                    aria-label="Configurações da Loja"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>

                  <Link 
                    href="/admin" 
                    className={`h-10 w-10 sm:w-auto sm:px-4 rounded-xl transition-smooth flex items-center justify-center gap-2 font-semibold text-sm ${
                      pathname === "/admin" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </>
              )}

              {user ? (
                <>
                  <Link 
                    href="/endereco" 
                    className={`h-10 w-10 rounded-xl transition-smooth flex items-center justify-center ${
                      pathname === "/endereco" ? "bg-accent" : "bg-secondary hover:bg-accent"
                    }`}
                    aria-label="Endereços"
                  >
                    <MapPin className="h-4 w-4" />
                  </Link>
                  
                  <Link href="/perfil" className="h-10 w-10 rounded-xl bg-secondary hover:bg-accent transition-smooth flex items-center justify-center" aria-label="Perfil">
                    <UserIcon className="h-5 w-5" />
                  </Link>
                  <button onClick={handleLogout} className="h-10 w-10 rounded-xl bg-secondary hover:bg-accent transition-smooth flex items-center justify-center" aria-label="Sair">
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link href="/login" className="h-10 px-4 rounded-xl bg-secondary hover:bg-accent transition-smooth flex items-center font-medium text-sm">
                  Entrar
                </Link>
              )}
            </>
          )}

          <button
            onClick={() => setOpen(true)}
            className="relative h-10 w-10 rounded-xl bg-secondary hover:bg-accent transition-smooth flex items-center justify-center"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}