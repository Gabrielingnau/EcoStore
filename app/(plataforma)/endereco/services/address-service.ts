import { supabaseBrowser } from "@/lib/supabase/client";
import { UserAddress } from "../types/user-settings-types";

const supabase = supabaseBrowser() as any;

export async function getAddresses(userId: string) {
  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", userId)
    .order("active", { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveAddress(data: UserAddress & { user_id: string }) {
  const { data: existingAddresses } = await supabase
    .from("user_addresses")
    .select("id")
    .eq("user_id", data.user_id);

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

// NOVA FUNÇÃO: Atualiza um endereço existente
export async function updateAddress(addressId: string, data: UserAddress) {
  const { error } = await supabase
    .from("user_addresses")
    .update(data)
    .eq("id", addressId);

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
  const { error: deactivateError } = await supabase
    .from("user_addresses")
    .update({ active: false })
    .eq("user_id", userId);

  if (deactivateError) throw deactivateError;

  const { error: activateError } = await supabase
    .from("user_addresses")
    .update({ active: true })
    .eq("id", addressId);

  if (activateError) throw activateError;
}