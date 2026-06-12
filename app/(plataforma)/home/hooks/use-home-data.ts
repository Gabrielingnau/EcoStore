import { getAllProducts } from "../services/get-home-data";

export async function getHomeContent() {
  try {
    const products = await getAllProducts();
    
    // Separação lógica: Produtos em Destaque vs Todos
    const featured = products.filter((p) => p.destaque);
    const currentYear = new Date().getFullYear();

    return {
      products,
      featured,
      currentYear
    };
  } catch (error) {
    console.error("Erro no getHomeContent:", error);
    return {
      products: [],
      featured: [],
      currentYear: new Date().getFullYear()
    };
  }
}