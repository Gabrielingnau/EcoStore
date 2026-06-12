import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await supabaseServer();
  
  const { data: integration } = await supabase
    .from("integrations")
    .select("access_token")
    .order("created_at", { ascending: false })
    .single();

  if (!integration?.access_token) {
    return NextResponse.json({ error: "Nenhum token encontrado" }, { status: 404 });
  }

  // Dados de teste para o cálculo de frete
  const payload = {
    "from": { "postal_code": "01001000" }, // CEP de origem (exemplo)
    "to": { "postal_code": "20040003" },   // CEP de destino (exemplo)
    "products": [
      {
        "name": "Produto Teste",
        "quantity": 1,
        "unitary_weight": 0.5,
        "unitary_price": 100,
        "width": 11,
        "height": 11,
        "length": 16
      }
    ]
  };

  const response = await fetch("https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${integration.access_token}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "EcoStore (gabrielimgnau@gmail.com)" 
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  return NextResponse.json({
    status: response.ok ? "Sucesso!" : "Falha na cotação",
    httpStatus: response.status,
    dados: data
  });
}