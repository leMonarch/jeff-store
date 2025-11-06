import { apiService } from "./apiService";
import type { Product } from "../types/Product";

export async function fetchProducts(category?: string): Promise<Product[]> {
  const endpoint = category ? `/products?category=${category}` : "/products";
  const products = await apiService.get<Product[]>(endpoint);
  // Convertir les IDs numériques en strings pour compatibilité avec le frontend
  return products.map((p) => ({
    ...p,
    id: p.id.toString(),
    price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
  }));
}

export async function fetchProduct(id: string): Promise<Product> {
  const product = await apiService.get<Product>(`/products/${id}`);
  return {
    ...product,
    id: product.id.toString(),
    price: typeof product.price === "string" ? parseFloat(product.price) : product.price,
  };
}




