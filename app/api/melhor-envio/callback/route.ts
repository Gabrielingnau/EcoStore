import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // 1. Tratamento de erro vindo do Melhor Envio
  if (error) {
    console.error("Erro retornado pelo Melhor Envio:", { error, errorDescription });
    return NextResponse.json({ error: "Autorização negada pelo provedor", details: error }, { status: 400 });
  }

  // 2. Validação de código
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const response = await fetch("https://api.melhorenvio.com.br/oauth/token", {
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

  // Leitura segura da resposta para evitar erro de syntax (Unexpected token <)
  const responseText = await response.text();
  let data;

  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error("ERRO: Resposta inválida (HTML detectado):", responseText);
    return NextResponse.json({ 
      error: "O Melhor Envio retornou um formato inválido. Verifique o console da Vercel.", 
      raw: responseText 
    }, { status: 500 });
  }

  // 4. Se a requisição falhou, logamos o detalhe real
  if (!response.ok) {
    console.error("ERRO DO MELHOR ENVIO (OAuth):", data);
    return NextResponse.json({ error: "Falha na troca de token", details: data }, { status: response.status });
  }

  // 5. Salva no banco
  if (data.access_token) {
    const supabase = await supabaseServer();

    const { error: dbError } = await supabase.from("integrations").upsert({
      singleton_id: true,
      provider: 'melhor_envio',
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString(),
    });

    if (dbError) {
      console.error("Erro ao salvar no banco:", dbError);
      return NextResponse.json({ error: "Falha ao salvar token no banco" }, { status: 500 });
    }

    return NextResponse.redirect(new URL(`/configuracoes?success=true`, process.env.NEXT_PUBLIC_BASE_URL!));
  }

  return NextResponse.json({ error: "Token não retornado pelo provedor", details: data }, { status: 500 });
}