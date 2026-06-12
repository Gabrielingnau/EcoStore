import type { Database } from "@/types/database";

export type ReviewRow =
  Database["public"]["Tables"]["reviews"]["Row"];

export type ReviewInsert =
  Database["public"]["Tables"]["reviews"]["Insert"];

export type ReviewUpdate =
  Database["public"]["Tables"]["reviews"]["Update"];