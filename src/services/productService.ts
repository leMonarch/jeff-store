import { apiService } from "./apiService";
import type { Product } from "../types/Product";

export async function fetchProducts(category?: string): Promise<Product[]> {
  // Les routes produits utilisent la langue automatiquement via apiService
  const endpoint = category ? `/products?category=${category}` : "/products";
  const products = await apiService.get<Product[]>(endpoint, true); // true = utiliser la langue
  // Convertir les IDs numériques en strings pour compatibilité avec le frontend
  return products.map((p) => ({
    ...p,
    id: p.id.toString(),
    price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
  }));
}

export async function fetchProduct(id: string): Promise<Product> {
  // Les routes produits utilisent la langue automatiquement via apiService
  const product = await apiService.get<Product>(`/products/${id}`, true); // true = utiliser la langue
  return {
    ...product,
    id: product.id.toString(),
    price: typeof product.price === "string" ? parseFloat(product.price) : product.price,
  };
}




