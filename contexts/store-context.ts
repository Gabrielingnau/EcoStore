// contexts/store-context.ts (ou onde estiver seu StoreContext)
"use client";

import { createContext } from "react";

export interface StoreConfig {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip_code: string;
  address: string;
  // Novas propriedades adicionadas para a logística flexível
  allow_local_pickup: boolean;
  allow_local_delivery: boolean;
  local_delivery_fee: number;
}

export interface StoreContextType {
  config: StoreConfig | null;
  isLoading: boolean;
}

export const StoreContext = createContext<StoreContextType>({
  config: null,
  isLoading: true,
});