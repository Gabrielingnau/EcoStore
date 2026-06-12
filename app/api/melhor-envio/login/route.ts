import { NextResponse } from "next/server";

export async function GET() {
  // Altere a linha do scope no seu arquivo de autorização:
  const params = new URLSearchParams({
    client_id: process.env.MELHOR_ENVIO_CLIENT_ID!,
    redirect_uri:
      "https://family-eggshell-lumping.ngrok-free.dev/api/melhor-envio/callback",
    response_type: "code",
    // Adicione todos os escopos necessários separados por espaço
    scope:
      "shipping-calculate shipping-checkout shipping-print cart-write cart-read shipping-tracking",
    state: "random_string_para_seguranca",
  });

  return NextResponse.redirect(
    `https://sandbox.melhorenvio.com.br/oauth/authorize?${params.toString()}`,
  );
}
