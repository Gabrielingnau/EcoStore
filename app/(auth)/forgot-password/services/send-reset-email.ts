import { supabaseBrowser } from "@/lib/supabase/client";
import { ForgotPasswordData } from "../types/forgot-password-type";

export async function sendResetPasswordEmail(email: ForgotPasswordData) {
  const supabase = supabaseBrowser();
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL;

  const { error } = await supabase.auth.resetPasswordForEmail(email.email, {
    // CORREÇÃO: Removemos o '(auth)' para que o Next.js reconheça a rota pública
    redirectTo: `${baseUrl}/callback?next=/reset-password`,
  });

  if (error) throw error;
  return true;
}
