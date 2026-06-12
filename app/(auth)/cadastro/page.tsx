"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { maskPhone } from "@/lib/utils"; // Importação da máscara
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { signupUser } from "./services/auth-service";
import { SignupFormData, signupSchema } from "./types/auth";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);

  // Dentro do seu SignupForm
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      toast.success("Conta criada! Verifique seu e-mail.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Função para lidar com a máscara e atualizar o estado do hook-form
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhone(e.target.value);
    setValue("phone", maskedValue, { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-10 py-10">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Criar conta
        </h1>
        <p className="text-muted-foreground">
          Cadastre-se para gerenciar seus pedidos.
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-6"
      >
        {/* Nome */}
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="font-bold text-xs uppercase tracking-widest text-muted-foreground"
          >
            Nome Completo
          </Label>
          <Input
            id="name"
            placeholder="Gabriel Lingnau"
            {...register("name")}
            className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background transition-all"
          />
          {errors.name && (
            <p className="text-xs font-bold text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-bold text-xs uppercase tracking-widest text-muted-foreground"
          >
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            {...register("email")}
            className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background transition-all"
          />
          {errors.email && (
            <p className="text-xs font-bold text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="font-bold text-xs uppercase tracking-widest text-muted-foreground"
          >
            Telefone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(00) 99999-9999"
            {...register("phone", { onChange: handlePhoneChange })}
            className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background transition-all"
          />
          {errors.phone && (
            <p className="text-xs font-bold text-destructive">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Senha */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="font-bold text-xs uppercase tracking-widest text-muted-foreground"
          >
            Senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="h-12 rounded-xl bg-muted/50 border-transparent pr-12 focus:bg-background transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-bold text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 w-full font-bold rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            "Criar conta agora"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Já possui uma conta?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Entrar
        </Link>
      </div>
    </div>
  );
}
