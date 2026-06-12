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
}

export interface StoreContextType {
  config: StoreConfig | null;
  isLoading: boolean;
}

export const StoreContext = createContext<StoreContextType>({
  config: null,
  isLoading: true,
});