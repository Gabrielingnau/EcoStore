import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await supabaseServer(); 
    
    // Consulta a tabela 'integrations' filtrando pelo provider
    const { data, error } = await supabase
      .from("integrations")
      .select("access_token")
      .eq("provider", "melhor_envio")
      .maybeSingle();

    console.log("DEBUG BACKEND - Erro:", error);
    console.log("DEBUG BACKEND - Dados encontrados:", data);

    // Se houve erro na consulta ou se não encontrou o registro com access_token, está desconectado
    if (error || !data || !data.access_token) {
      console.log("DEBUG BACKEND: Integração não encontrada ou token ausente.");
      return NextResponse.json({ connected: false });
    }

    console.log("DEBUG BACKEND: Integração encontrada e token presente.");
    return NextResponse.json({ connected: true });
    
  } catch (error) {
    console.error("DEBUG BACKEND - Erro fatal:", error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}