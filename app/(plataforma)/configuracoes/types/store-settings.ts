import * as yup from "yup";

export const storeConfigSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  city: yup.string().required("Cidade é obrigatória"),
  state: yup.string().length(2, "Use a sigla (ex: SP)").required(),
  zip_code: yup.string().required("CEP é obrigatório"),
  address: yup.string().required("Endereço é obrigatório"),
  // Novos campos
  allow_local_pickup: yup.boolean().default(false),
  allow_local_delivery: yup.boolean().default(false),
  local_delivery_fee: yup.number().min(0).default(0),
});

export type StoreConfig = yup.InferType<typeof storeConfigSchema>;