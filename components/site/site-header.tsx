"use client";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            {config?.name || "Loja"}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/contato"
            className="h-10 w-10 sm:w-auto sm:px-4 rounded-xl hover:bg-secondary transition-smooth flex items-center justify-center gap-2 font-medium text-sm"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Contato</span>
          </Link>

          <NotificationBell userId={user?.id} />

          {loading ? (
            <div className="h-10 w-10 rounded-xl bg-secondary/50 animate-pulse" />
          ) : user ? (
            <>
              {/* --- MODO PC: Ícones separados --- */}
              {isAdmin && (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/configuracoes"
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${pathname === "/configuracoes" ? "bg-accent" : "hover:bg-accent"}`}
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/admin"
                    className={`h-10 px-4 rounded-xl flex items-center gap-2 ${pathname === "/admin" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
                  >
                    <Shield className="h-4 w-4" /> <span>Admin</span>
                  </Link>
                </div>
              )}

              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/endereco"
                  className={`h-10 w-10 rounded-xl flex items-center justify-center ${pathname === "/endereco" ? "bg-accent" : "bg-secondary hover:bg-accent"}`}
                >
                  <MapPin className="h-4 w-4" />
                </Link>
                <Link
                  href="/perfil"
                  className="h-10 w-10 rounded-xl bg-secondary hover:bg-accent flex items-center justify-center"
                >
                  <UserIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="h-10 w-10 rounded-xl bg-secondary hover:bg-accent flex items-center justify-center"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>

              {/* --- MODO CELULAR: Dropdown único --- */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-10 w-auto px-2 rounded-xl bg-secondary hover:bg-accent transition-smooth flex items-center justify-center gap-1">
                    <UserIcon className="h-5 w-5" />
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
                      onClick={handleLogout}
                      className="text-red-500"
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
              className="h-10 px-4 rounded-xl bg-secondary hover:bg-accent flex items-center font-medium text-sm"
            >
              Entrar
            </Link>
          )}

          <button
            onClick={() => setOpen(true)}
            className="relative h-10 w-10 rounded-xl bg-secondary hover:bg-accent transition-smooth flex items-center justify-center"
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
