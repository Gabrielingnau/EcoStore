"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { login } from "../services/login"
import { loginSchema, LoginFormData } from "../types/login-form"

export function useLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  })

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      setAuthError(null)
      const authData = await login(data)
      
      if (!authData?.user) {
        throw new Error("Usuário não encontrado")
      }

      return authData
    },
    onSuccess: () => {
      setIsRedirecting(true) 
      toast.success("Bem-vindo de volta!")
      router.replace("/")
      router.refresh()
    },
    onError: (error: any) => {
      setIsRedirecting(false)
      const message = error.message === "Invalid login credentials" 
        ? "E-mail ou senha incorretos." 
        : "Ocorreu um erro ao acessar a conta."
        
      setAuthError(message)
      toast.error(message)
    },
  })

  const handleInputChange = () => {
    if (authError) setAuthError(null)
  }

  const togglePassword = () => setShowPassword((prev) => !prev)

  return {
    form,
    isPending: isPending || isRedirecting, 
    authError,
    showPassword,
    togglePassword,
    handleInputChange,
    onSubmit: form.handleSubmit((data) => loginUser(data)),
  }
}