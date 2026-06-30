import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // 1. Tratamento de erro retornado pelo Melhor Envio
  if (error) {
    console.error("Erro retornado pelo Melhor Envio:", { error, errorDescription });
    return NextResponse.json({ 
      error: "Autorização negada pelo provedor", 
      details: error,
      description: errorDescription 
    }, { status: 400 });
  }

  // 2. Validação básica de presença de código
  if (!code) {
    console.error("Callback chamado sem código.");
    return NextResponse.json({ 
      error: "No code provided",
      message: "O Melhor Envio não enviou o código de autorização."
    }, { status: 400 });
  }

  // 3. Troca do código pelo token
  // URL fixa de produção para evitar erros de DNS/variáveis em ambientes complexos
  const MELHOR_ENVIO_API_URL = "https://api.melhorenvio.com.br";

  try {
    const response = await fetch(`${MELHOR_ENVIO_API_URL}/oauth/token`, {
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

    // Leitura segura da resposta (evita crash com HTML)
    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("ERRO: Resposta não é JSON. Conteúdo recebido:", responseText);
      return NextResponse.json({ 
        error: "O Melhor Envio retornou um formato inválido (possível erro 404/500).", 
        raw: responseText 
      }, { status: 500 });
    }

    if (!response.ok) {
      console.error("ERRO DO MELHOR ENVIO (OAuth):", data);
      return NextResponse.json({ error: "Falha na troca de token", details: data }, { status: response.status });
    }

    // 4. Salvar no Supabase
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
        return NextResponse.json({ error: "Falha ao salvar token no banco", details: dbError }, { status: 500 });
      }

      // 5. Redirecionamento de sucesso
      return NextResponse.redirect(new URL(`/configuracoes?success=true`, process.env.NEXT_PUBLIC_BASE_URL!));
    }

    return NextResponse.json({ error: "Token não retornado pelo provedor", details: data }, { status: 500 });

  } catch (fetchError) {
    // Captura erros de rede como o ENOTFOUND
    console.error("ERRO DE CONEXÃO (Network):", fetchError);
    return NextResponse.json({ 
      error: "Falha de conexão com o Melhor Envio. O servidor pode estar offline ou com erro de DNS.", 
      details: fetchError instanceof Error ? fetchError.message : "Erro desconhecido" 
    }, { status: 503 });
  }
}