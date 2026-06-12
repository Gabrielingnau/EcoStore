import { supabaseBrowser } from "@/lib/supabase/client";
import { UserAddress } from "../types/user-settings-types";

const supabase = supabaseBrowser() as any;

export async function getAddresses(userId: string) {
  // Busca todos os endereços do usuário atual, independente de ser admin ou não
  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", userId)
    .order("active", { ascending: false }); // Traz o ativo primeiro

  if (error) throw error;
  return data;
}

// No seu address-service.ts
export async function saveAddress(data: UserAddress & { user_id: string }) {
  // Busca se o usuário já possui endereços
  const { data: existingAddresses } = await supabase
    .from("user_addresses")
    .select("id")
    .eq("user_id", data.user_id);

  // Se for o primeiro, define como ativo
  const isFirst = !existingAddresses || existingAddresses.length === 0;

  const { error } = await supabase
    .from("user_addresses")
    .insert({ 
      ...data, 
      user_id: data.user_id,
      active: isFirst ? true : data.active 
    });
      
  if (error) throw error;
}

export async function deleteAddress(addressId: string) {
  const { error } = await supabase
    .from("user_addresses")
    .delete()
    .eq("id", addressId);

  if (error) throw error;
}

export async function setActiveAddress(addressId: string, userId: string) {
  console.log("Ativando endereço", { addressId, userId });
  const { error: deactivateError } = await supabase
    .from("user_addresses")
    .update({ active: false })
    .eq("user_id", userId);

  if (deactivateError) throw deactivateError;

  // 2. Ativa o endereço selecionado
  const { error: activateError } = await supabase
    .from("user_addresses")
    .update({ active: true })
    .eq("id", addressId);

  if (activateError) throw activateError;
}