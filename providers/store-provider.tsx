"use client";
import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabaseBrowser } from "@/lib/supabase/client";
import { StoreContext, StoreConfig } from "@/contexts/store-context";

export function StoreProvider({ children }: { children: ReactNode }) {
  const supabase = supabaseBrowser();

  const { data, isLoading } = useQuery({
    queryKey: ["storeConfig"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_config")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data as StoreConfig | null;
    },
    staleTime: 1000 * 60 * 60, // Cache de 1 hora
  });

  return (
    <StoreContext.Provider value={{ config: data ?? null, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
}