import * as yup from "yup";

export const storeConfigSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  city: yup.string().required("Cidade é obrigatória"),
  state: yup.string().length(2, "Use a sigla (ex: SP)").required(),
  zip_code: yup.string().required("CEP é obrigatório"),
  address: yup.string().required("Endereço é obrigatório"),
});

export type StoreConfig = yup.InferType<typeof storeConfigSchema>;