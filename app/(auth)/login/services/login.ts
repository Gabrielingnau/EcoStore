import { supabaseBrowser } from "@/lib/supabase/client"
import { LoginFormData } from "../types/login-form"

export async function login({ email, password }: LoginFormData) {
  // 1. Você precisa dar await na função para receber o client
  const supabase = await supabaseBrowser()

  // 2. Agora você acessa o .auth no client retornado
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}