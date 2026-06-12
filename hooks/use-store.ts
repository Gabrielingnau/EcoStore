"use client";
import { useContext } from "react";
import { StoreContext } from "@/contexts/store-context";

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore deve ser usado dentro de um StoreProvider");
  }
  return context;
}