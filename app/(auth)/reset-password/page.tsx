"use client"

import { Check, X, ShieldCheck, AlertCircle, LockKeyhole } from "lucide-react"
import { useResetPassword } from "./hook/use-reset-password"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const { 
    form: { register }, 
    rules, 
    isPending, 
    isSamePasswordError, 
    onSubmit, 
    allRulesValid 
  } = useResetPassword()

  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-4">
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
          <ShieldCheck className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Nova Senha</h1>
          <p className="text-muted-foreground text-sm">
            Crie uma senha segura para acessar a plataforma EcoStore.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password">Nova Senha</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              id="password"
              type="password" 
              placeholder="••••••••"
              className="h-12 pl-12 rounded-xl border-input focus-visible:ring-primary"
              {...register("password")} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              id="confirmPassword"
              type="password" 
              placeholder="••••••••"
              className="h-12 pl-12 rounded-xl border-input focus-visible:ring-primary"
              {...register("confirmPassword")} 
            />
          </div>
        </div>

        <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1">
            Requisitos de segurança
          </p>
          {rules.map((rule, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className={`flex items-center justify-center w-5 h-5 rounded-full border transition-colors ${
                rule.valid ? "bg-green-500/10 border-green-500" : "bg-transparent border-muted-foreground/20"
              }`}>
                {rule.valid ? (
                  <Check size={12} className="text-green-600 font-bold" />
                ) : (
                  <X size={10} className="text-muted-foreground/40" />
                )}
              </div>
              <span className={`transition-colors ${rule.valid ? "text-green-700 font-medium" : "text-muted-foreground"}`}>
                {rule.label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Button 
            type="submit"
            className="h-12 w-full font-bold rounded-xl text-md shadow-lg shadow-primary/10 active:scale-[0.98]" 
            disabled={isPending || !allRulesValid}
          >
            {isPending ? "Salvando alterações..." : "Confirmar e Acessar"}
          </Button>

          {isSamePasswordError && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/10 text-destructive animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-xs font-semibold leading-relaxed">
                A nova senha não pode ser igual à senha anterior.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}