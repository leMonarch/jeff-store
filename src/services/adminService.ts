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
  productData: {
    nameFr: string;
    nameEn: string;
    descriptionFr?: string;
    descriptionEn?: string;
    categoryFr: string;
    categoryEn: string;
    mediumFr?: string;
    mediumEn?: string;
    price: number;
    imageUrl: string;
    dimensions?: string;
    stock?: number;
    active: boolean;
    sendNewsletter: boolean;
  }
): Promise<Product> {
  // Route POST /products n'utilise pas la langue (création avec toutes les traductions)
  const product = await apiService.post<Product>(
    "/products",
    {
      ...productData,
      price: typeof productData.price === "string" 
        ? parseFloat(productData.price) 
        : productData.price,
    },
    false // Pas de langue pour la création
  );
  
  // Convertir l'ID numérique en string pour compatibilité
  return {
    ...product,
    id: product.id.toString(),
  };
}

// Réexporter les fonctions de newsletter pour compatibilité
export { sendManualNewsletter, getSubscriberCount };
