import { supabaseBrowser } from "@/lib/supabase/client";
import { SignupFormData } from "../types/auth";

export async function signupUser(data: SignupFormData) {
  const supabase = supabaseBrowser();
  
  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { 
      data: { 
        display_name: data.name,
        phone: data.phone // Salvando o telefone no metadata
      },
      emailRedirectTo: `${window.location.origin}/callback` 
    },
  });

  if (error) throw error;
  return authData;
}