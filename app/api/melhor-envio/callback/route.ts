import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // 1. Tratamento de erro retornado pelo provedor
  if (error) {
    console.error("Erro retornado pelo Melhor Envio:", { error, errorDescription });
    return NextResponse.json({ 
      error: "Autorização negada pelo provedor", 
      details: error,
      description: errorDescription 
    }, { status: 400 });
  }

  // 2. Validação de código
  if (!code) {
    console.error("Callback chamado sem código.");
    return NextResponse.json({ 
      error: "No code provided",
      message: "O Melhor Envio não enviou o código de autorização."
    }, { status: 400 });
  }

  // 3. Troca o código pelo token no Melhor Envio
  const response = await fetch(`${process.env.MELHOR_ENVIO_URL}/oauth/token`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.MELHOR_ENVIO_CLIENT_ID,
      client_secret: process.env.MELHOR_ENVIO_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/melhor-envio/callback`, 
      code: code,
    }),
  });

  const data = await response.json();

  // 4. Se obteve o token com sucesso
  if (data.access_token) {
    const supabase = await supabaseServer();

    // 5. Salva no banco usando a lógica Singleton
    // Como a tabela só tem uma linha com singleton_id = true, o upsert substituirá os tokens
    const { error: dbError } = await supabase.from("integrations").upsert({
      singleton_id: true,
      provider: 'melhor_envio',
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    });

    if (dbError) {
      console.error("Erro ao salvar no banco:", dbError);
      return NextResponse.json({ error: "Falha ao salvar token no banco", details: dbError }, { status: 500 });
    }

    // 6. Redireciona com sucesso
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/configuracoes?success=true`, request.url));
  }

  // 7. Tratamento caso a troca do código falhe (ex: code revogado/expirado)
  console.error("Erro do Melhor Envio (OAuth):", data); 
  return NextResponse.json({ 
    error: "Falha na troca do código pelo token", 
    details: data,
    hint: "O código pode ter expirado ou já ter sido utilizado." 
  }, { status: 500 });
}