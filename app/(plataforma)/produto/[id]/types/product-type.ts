import { Database } from "@/types/database";

export type ProductDatabase = Database["public"]["Tables"]["products"]["Row"];
export type ProductImagesDatabase = Database["public"]["Tables"]["product_images"]["Row"][];

export type VariantSizeDatabase = Database["public"]["Tables"]["variant_sizes"]["Row"];

export type ProductVariantDatabase = Database["public"]["Tables"]["product_variants"]["Row"] & {
  variant_sizes?: VariantSizeDatabase[];
};