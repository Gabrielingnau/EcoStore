import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  
  // Ajustado para 'reset-password' conforme sua estrutura de pastas
  const next = searchParams.get("next") ?? "/reset-password"

  if (code) {
    const supabase = await supabaseServer()

    // Troca o código PKCE pela sessão real
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const redirectUrl = new URL(next, origin)
      
      // Se o destino for reset-password, avisamos o middleware
      if (next === "/reset-password") {
        redirectUrl.searchParams.set("type", "recovery")
      }
      
      return NextResponse.redirect(redirectUrl.toString())
    }
    
    console.error("Erro no Callback Auth:", error.message)
  }

  // Em caso de erro, volta para o login com aviso
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}