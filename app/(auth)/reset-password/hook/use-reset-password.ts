"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { updatePassword } from "../services/reset-password"
import { resetPasswordSchema, ResetPasswordData } from "../types/reset-password-type"
import { supabaseBrowser } from "@/lib/supabase/client"

export function useResetPassword() {
  const router = useRouter()
  const [isSamePasswordError, setIsSamePasswordError] = useState(false)
  
  const form = useForm<ResetPasswordData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })
  
  const password = form.watch("password", "")
  const confirmPassword = form.watch("confirmPassword", "")

  const rules = [
    { label: "Mínimo de 6 caracteres", valid: password.length >= 6 },
    { label: "Pelo menos um número", valid: /\d/.test(password) },
    { label: "As senhas coincidem", valid: password === confirmPassword && password !== "" }
  ]

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      setIsSamePasswordError(false)
      const supabase = supabaseBrowser()

      // 1. Atualiza a senha no Auth
      await updatePassword(data.password)

      // 2. Busca o usuário atual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não encontrado.")
    },
    onSuccess: () => {
      toast.success("Senha atualizada com sucesso!")
      router.replace("/")
      router.refresh()
    },
    onError: (err: any) => {
      if (err.message?.toLowerCase().includes("different") || err.status === 422) {
        setIsSamePasswordError(true)
        toast.error("A nova senha deve ser diferente da atual.")
      } else {
        toast.error(err.message || "Erro ao atualizar senha")
      }
    }
  })

  return {
    form,
    rules,
    isPending,
    isSamePasswordError,
    allRulesValid: rules.every(r => r.valid),
    onSubmit: form.handleSubmit((data) => mutate(data)),
  }
}