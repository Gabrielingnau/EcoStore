"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { sendResetPasswordEmail } from "../services/send-reset-email"
import { ForgotPasswordData } from "../types/forgot-password-type"

export function useForgotPassword() {
  const [countdown, setCountdown] = useState(0)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<ForgotPasswordData>()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const { mutate, isPending } = useMutation({
    mutationFn: (email: string) => sendResetPasswordEmail({ email }),
    onSuccess: () => {
      toast.success("Link enviado!", {
        description: "Verifique sua caixa de entrada e spam."
      })
      setCountdown(60) 
      reset()
    },
    onError: (error: any) => {
      const message = error.message === "Too many requests" 
        ? "Muitas tentativas. Tente novamente em instantes." 
        : "Não foi possível enviar o link. Verifique o e-mail."
        
      toast.error(message)
    }
  })

  return {
    register,
    errors,
    isPending,
    countdown,
    onSubmit: handleSubmit((data) => mutate(data.email)),
  }
}