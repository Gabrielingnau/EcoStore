"use client"

import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLogin } from "./hook/use-login"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const { 
    form: { register, formState: { errors } }, 
    onSubmit, 
    isPending, 
    authError, 
    showPassword, 
    togglePassword, 
    handleInputChange 
  } = useLogin()

  return (
    <div className="w-full max-w-sm mx-auto space-y-10 py-10">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Acessar conta</h1>
        <p className="text-muted-foreground">Informe seus dados para gerenciar seus pedidos.</p>
      </div>

      {authError && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive animate-in fade-in zoom-in duration-300">
          <AlertCircle size={20} className="shrink-0" />
          <p className="font-semibold">{authError}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            {...register("email", { onChange: handleInputChange })}
            className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background transition-all"
          />
          {errors.email && <p className="text-xs font-bold text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Senha</Label>
            <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">Esqueceu?</Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { onChange: handleInputChange })}
              className="h-12 rounded-xl bg-muted/50 border-transparent pr-12 focus:bg-background transition-all"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs font-bold text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="h-12 w-full font-bold rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin mr-2" /> : "Entrar agora"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Ainda não tem conta? <Link href="/cadastro" className="font-bold text-primary hover:underline">Crie uma agora</Link>
      </div>
    </div>
  )
}