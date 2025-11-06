import { apiService } from "./apiService";
import type { Product } from "../types/Product";

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product: Product;
}

/**
 * Ajouter un produit aux favoris
 */
export async function addToFavorites(productId: string): Promise<Favorite> {
  // Route favorites n'utilise pas la langue
  return apiService.post<Favorite>(
    "/favorites",
    {
      productId: parseInt(productId),
    },
    false
  );
}

/**
 * Retirer un produit des favoris
 */
export async function removeFromFavorites(productId: string): Promise<void> {
  // Route favorites n'utilise pas la langue
  return apiService.delete<void>(`/favorites/${productId}`, false);
}

/**
 * Récupérer tous les favoris de l'utilisateur connecté
 */
export async function getUserFavorites(): Promise<Favorite[]> {
  // Route favorites n'utilise pas la langue
  return apiService.get<Favorite[]>("/favorites", false);
}

/**
 * Vérifier si un produit est dans les favoris de l'utilisateur
 */
export async function isFavorite(productId: string): Promise<boolean> {
  try {
    // Route favorites n'utilise pas la langue
    const response = await apiService.get<{ isFavorite: boolean }>(
      `/favorites/check/${productId}`,
      false
    );
    return response.isFavorite;
  } catch {
    return false;
  }
}

/**
 * Récupérer tous les IDs de produits favoris de l'utilisateur connecté
 */
export async function getFavoriteProductIds(): Promise<string[]> {
  const favorites = await getUserFavorites();
  return favorites.map((fav) => fav.productId.toString());
}

