import * as yup from "yup";

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("Senha obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("Confirmação obrigatória"),
}).required();

export type ResetPasswordData = yup.InferType<typeof resetPasswordSchema>;