import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup.string().required("O nome é obrigatório"),
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  phone: yup.string().required("O telefone é obrigatório"),
  password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("A senha é obrigatória"),
});

export type SignupFormData = yup.InferType<typeof signupSchema>;