import { supabaseBrowser } from "@/lib/supabase/client";

export async function updatePassword(password: string) {
  const supabase = supabaseBrowser();
  
  const { data, error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) throw error;
  return data;
}