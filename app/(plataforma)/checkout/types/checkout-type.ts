import { unmask } from '@/lib/utils';
import { Database } from '@/types/database';
import * as yup from 'yup';

// types/checkout-type.ts

// Esta interface descreve o objeto exato que seu checkout envia para o Supabase
export interface PlaceOrderPayload {
  _items: {
    product_id: string;
    quantity: number;
    weight: number;
    width: number;
    height: number;
    length: number;
  }[];
  _shipping_name: string;
  _shipping_address: string;
  _shipping_city: string;
  _shipping_zip: string;
  _shipping_phone?: string | null;
  _shipping_email?: string | null;
  _shipping_document: string;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string | null; 
  zip: string;
  address: string;
  city: string;
  document: string; // Adicionado
}

const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf.substring(10, 11));
};

export const checkoutSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  phone: yup.string().nullable().defined(),
  zip: yup.string().required("CEP é obrigatório"),
  address: yup.string().required("Endereço é obrigatório"),
  city: yup.string().required("Cidade é obrigatória"),
  // Valida o CPF com ou sem pontos/traço
  document: yup.string()
  .required("CPF é obrigatório")
  .test("is-valid-cpf", "CPF inválido", (val) => validateCPF(val || ""))
});