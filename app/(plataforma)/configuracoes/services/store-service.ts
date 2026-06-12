import { supabaseBrowser } from "@/lib/supabase/client";
import { StoreConfig } from "../types/store-settings";

export async function getStoreConfig() {
  const { data, error } = await supabaseBrowser()
    .from("store_config")
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data as StoreConfig | null;
}

export async function upsertStoreConfig(data: StoreConfig) {
  // O 'as any' é a forma mais segura de contornar a rigidez do Supabase
  // quando estamos trabalhando com schemas customizados ou singleton tables
  const { error } = await supabaseBrowser()
    .from("store_config")
    .upsert({ ...data, id: true } as any); 

  if (error) throw error;
}