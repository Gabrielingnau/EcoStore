import { createClient } from "@supabase/supabase-js";

// Use a chave de serviço (service_role) que tem acesso total ao banco
// NUNCA coloque essa chave em componentes de cliente!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);