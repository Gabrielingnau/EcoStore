import { NextRequest, NextResponse } from "next/server";
import { createClientForMiddleware } from '@/lib/supabase/middleware';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  let response = NextResponse.next({
    request: { headers: req.headers },
  });

  const supabase = createClientForMiddleware(req, response);

  // 1. ROTAS PÚBLICAS
  const publicRoutes = ["/login", "/forgot-password", "/cadastro", "/produto"];
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return response;
  }

  // 2. VERIFICAÇÃO DE SESSÃO
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    if (path.startsWith("/admin") || path.startsWith("/configuracoes") || path.startsWith("/endereco")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return response;
  }

  // 3. CHECAGEM DE ROLE (Proteção Admin)
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const role = (roleData as { role: string } | null)?.role?.toLowerCase();
  const isAdmin = role === "admin";

  // Bloquear acesso não-admin a rotas protegidas
  if ((path.startsWith("/admin") || path.startsWith("/configuracoes")) && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 4. CHECAGEM DE LOJA CONFIGURADA (Somente para Admin logado)
  if (isAdmin) {
    const { data: config } = await supabase
      .from("store_config")
      .select("id")
      .maybeSingle();

    // Se não houver configuração e ele não estiver na página de config, redireciona
    if (!config && path !== "/configuracoes") {
      return NextResponse.redirect(new URL("/configuracoes", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};