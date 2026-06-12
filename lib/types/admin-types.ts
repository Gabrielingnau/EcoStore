import { Database } from "../../types/database";

export type Product = Database["public"]["Tables"]["products"]["Row"];

export type CartItem = { product: Product; quantity: number };
