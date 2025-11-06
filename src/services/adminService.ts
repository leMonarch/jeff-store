import { apiService } from "./apiService";
import { sendManualNewsletter, getSubscriberCount } from "./newsletterService";
import type { Product } from "../types";

export async function uploadImage(file: File): Promise<string> {
  // Vérifier la taille du fichier (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("L'image est trop grande. Taille maximale : 10MB");
  }

  try {
    const response = await apiService.uploadFile<{
      message: string;
      imageUrl: string;
      filename: string;
    }>("/upload/image", file);
    return response.imageUrl;
  } catch (error: any) {
    throw new Error(
      error.message || "Erreur lors de l'upload de l'image"
    );
  }
}

export async function addProduct(
  productData: Omit<Product, "id">
): Promise<Product> {
  const product = await apiService.post<Product>("/products", {
    ...productData,
    price: typeof productData.price === "string" 
      ? parseFloat(productData.price) 
      : productData.price,
  });
  
  // Convertir l'ID numérique en string pour compatibilité
  return {
    ...product,
    id: product.id.toString(),
  };
}

// Réexporter les fonctions de newsletter pour compatibilité
export { sendManualNewsletter, getSubscriberCount };
