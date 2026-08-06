"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  MapPin,
  Phone,
  Settings,
  Shield,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useStore } from "@/hooks/use-store";
import { useCart, useCartCount } from "@/lib/store/cart";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationBell } from "./notificatio-bell";

export function SiteHeader() {
  const setOpen = useCart((s) => s.setOpen);
  const count = useCartCount();
  const { user, isAdmin, loading } = useAuth();
  const { config } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Estado para controlar a abertura do modal de confirmação de saída
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    const supabase = supabaseBrowser() as any;
    await supabase.auth.signOut();
    queryClient.clear();
    toast.success("Sessão encerrada");
    setShowLogoutDialog(false);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="px-3 sm:px-6 lg:px-10 py-3.5 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-primary shadow-glow flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-lg">
                {config?.name.charAt(0) || "I"}
              </span>
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight hidden sm:block truncate max-w-[180px] md:max-w-none">
              {config?.name || "Loja"}
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/contato"
              aria-label="Contato"
              className="h-9 sm:h-10 w-9 sm:w-auto sm:px-4 rounded-xl hover:bg-secondary transition-smooth flex items-center justify-center gap-2 font-medium text-xs sm:text-sm"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contato</span>
            </Link>

            <NotificationBell userId={user?.id} />

            {loading ? (
              <div className="h-9 sm:h-10 w-9 sm:w-10 rounded-xl bg-secondary/50 animate-pulse" />
            ) : user ? (
              <>
                {/* --- MODO PC: Ícones separados --- */}
                {isAdmin && (
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      href="/configuracoes"
                      aria-label="Configurações"
                      className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${pathname === "/configuracoes" ? "bg-accent" : "hover:bg-accent"}`}
                    >
                      <Settings className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/admin"
                      className={`h-10 px-4 rounded-xl flex items-center gap-2 font-medium text-sm transition-colors ${pathname === "/admin" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                    >
                      <Shield className="h-4 w-4" /> <span>Admin</span>
                    </Link>
                  </div>
                )}

                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/endereco"
                    aria-label="Endereços"
                    className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${pathname === "/endereco" ? "bg-accent" : "bg-secondary hover:bg-accent"}`}
                  >
                    <MapPin className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/perfil"
                    aria-label="Meu Perfil"
                    className="h-10 w-10 rounded-xl bg-secondary hover:bg-accent transition-colors flex items-center justify-center"
                  >
                    <UserIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => setShowLogoutDialog(true)}
                    aria-label="Encerrar sessão"
                    className="h-10 w-10 rounded-xl bg-secondary hover:bg-accent transition-colors flex items-center justify-center"
                  >
                    <LogOut className="h-5 w-5 text-destructive" />
                  </button>
                </div>

                {/* --- MODO CELULAR: Dropdown único --- */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      aria-label="Menu do usuário"
                      className="h-9 w-auto px-2 rounded-xl bg-secondary hover:bg-accent transition-smooth flex items-center justify-center gap-1"
                    >
                      <UserIcon className="h-4 w-4" />
                      <ChevronDown className="h-3 w-3 opacity-60" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {isAdmin && (
                        <>
                          <DropdownMenuItem onClick={() => router.push("/admin")}>
                            <Shield className="mr-2 h-4 w-4" /> Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push("/configuracoes")}
                          >
                            <Settings className="mr-2 h-4 w-4" /> Configs
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => router.push("/perfil")}>
                        <UserIcon className="mr-2 h-4 w-4" /> Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/endereco")}>
                        <MapPin className="mr-2 h-4 w-4" /> Endereços
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowLogoutDialog(true)}
                        className="text-destructive focus:text-destructive font-medium"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-secondary hover:bg-accent transition-colors flex items-center font-medium text-xs sm:text-sm"
              >
                Entrar
              </Link>
            )}

            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir carrinho de compras"
              className="relative h-9 sm:h-10 w-9 sm:w-10 rounded-xl bg-secondary hover:bg-accent transition-smooth flex items-center justify-center"
            >
              <ShoppingBag className="h-4 sm:h-5 w-4 sm:w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* --- MODAL DE CONFIRMAÇÃO DE LOGOUT ALTAMENTE RESPONSIVO --- */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[400px] rounded-2xl p-5 sm:p-6 bg-background border border-border/80 shadow-2xl mx-auto">
          <DialogHeader className="space-y-2.5 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-1">
              <LogOut className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold">Deseja realmente sair?</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Você precisará fazer login novamente para acessar seus pedidos, carrinho e dados da conta.
            </DialogDescription>
          </DialogHeader>

          {/* Rodapé com botões perfeitamente alinhados e de tamanho uniforme */}
          <DialogFooter className="pt-2">
            <div className="grid grid-cols-2 gap-2.5 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLogoutDialog(false)}
                className="w-full h-11 rounded-xl text-xs sm:text-sm font-semibold border-border/80 hover:bg-secondary"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleLogout}
                className="w-full min-h-11 rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
              >
                Sim, sair
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}