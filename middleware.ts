import { NextRequest, NextResponse } from "next/server";
import { createClientForMiddleware } from '@/lib/supabase/middleware';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  let response = NextResponse.next({
    request: { headers: req.headers },
  });

  const supabase = createClientForMiddleware(req, response);

  // 1. ROTAS PÚBLICAS
  const publicRoutes = ["/login", "/callback", "/forgot-password", "/cadastro", "/produto"];
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return response;
  }

  // 2. VERIFICAÇÃO DE SESSÃO
  // O getUser() é otimizado e valida o JWT localmente sem nova query ao banco
  const { data: { user } } = await supabase.auth.getUser();
  
  // Se não estiver logado, protege rotas privadas básicas
  if (!user) {
    if (path.startsWith("/admin") || path.startsWith("/configuracoes") || path.startsWith("/endereco")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return response;
  }

  // A partir daqui, as verificações de "role" e "configuração de loja" 
  // devem ser feitas nas páginas (Server Components) usando fetch ou query 
  // diretamente no banco, pois lá o limite de tempo é muito maior.
  
  return response;
}

export const config = {
  // Mantemos o matcher, mas otimizado para excluir pastas óbvias
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};