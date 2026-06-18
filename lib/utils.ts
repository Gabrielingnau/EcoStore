import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Converte um número float do banco ou string de digitação em BRL aceitando o dígito 0 perfeitamente
export const maskBRL = (value: number | string): string => {
  if (value === undefined || value === null) return formatBRL(0);

  let digits = "";
  if (typeof value === "number") {
    // Transforma float do banco (ex: 12.5) em string de centavos inteiros ("1250")
    digits = Math.round(value * 100).toString();
  } else {
    digits = value.replace(/\D/g, "");
  }

  if (!digits || digits === "0") return formatBRL(0);

  const numValue = Number(digits) / 100;
  return formatBRL(numValue);
};

// Retorna a STRING de dígitos limpa para manter os zeros à direita salvos no estado durante a digitação
export const parseBRLToStringDigits = (v: string): string => {
  return v.replace(/\D/g, "");
};

// Converte a string de dígitos do estado local de volta em float antes de salvar no Supabase
export const parseDigitsToFloat = (v: string | number): number => {
  if (typeof v === "number") return v;
  const digits = v.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
};

// Remove qualquer caractere que não seja número (usado para travar o estoque)
export const maskOnlyNumbers = (v: string): string => v.replace(/\D/g, "");

// Input mask helpers existentes
export const maskCEP = (v: string) => v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
export const maskDate = (v: string) => v.replace(/\D/g, "").slice(0, 8).replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
export const maskCard = (v: string) => v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
export const maskExp = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
export const maskCVV = (v: string) => v.replace(/\D/g, "").slice(0, 4);
export const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};
export const unmask = (v: string) => v.replace(/\D/g, "");

export const maskCPF = (v: string) => {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export function isLocalZip(clientZip: string, storeZip: string): boolean {
  // Remove qualquer caractere que não seja número (hífen, espaço)
  const cleanClient = clientZip.replace(/\D/g, "");
  const cleanStore = storeZip.replace(/\D/g, "");

  // Compara os 5 primeiros dígitos
  return cleanClient.substring(0, 5) === cleanStore.substring(0, 5);
}