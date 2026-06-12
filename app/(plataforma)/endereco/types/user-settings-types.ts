import * as yup from "yup";

export const userAddressSchema = yup.object({
  zip_code: yup.string().required("CEP é obrigatório"),
  street: yup.string().required("Rua é obrigatória"),
  city: yup.string().required("Cidade é obrigatória"),
  state: yup.string().required("Estado é obrigatório"),
  active: yup.boolean().default(false),
});

export type UserAddress = yup.InferType<typeof userAddressSchema>;