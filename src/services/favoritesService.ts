import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import { db, auth } from "./firebase";

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

/**
 * Ajouter un produit aux favoris
 */
export async function addToFavorites(productId: string): Promise<void> {
  if (!auth.currentUser) {
    throw new Error("Vous devez être connecté pour ajouter aux favoris");
  }

  const userId = auth.currentUser.uid;

  // Vérifier si le produit est déjà en favoris
  const existingQuery = query(
    collection(db, "favorites"),
    where("userId", "==", userId),
    where("productId", "==", productId)
  );
  const existingDocs = await getDocs(existingQuery);

  if (!existingDocs.empty) {
    throw new Error("Ce produit est déjà dans vos favoris");
  }

  // Ajouter aux favoris
  await addDoc(collection(db, "favorites"), {
    userId,
    productId,
    createdAt: new Date(),
  });
}

/**
 * Retirer un produit des favoris
 */
export async function removeFromFavorites(productId: string): Promise<void> {
  if (!auth.currentUser) {
    throw new Error("Vous devez être connecté pour retirer des favoris");
  }

  const userId = auth.currentUser.uid;

  // Trouver le document favoris
  const favoriteQuery = query(
    collection(db, "favorites"),
    where("userId", "==", userId),
    where("productId", "==", productId)
  );
  const favoriteDocs = await getDocs(favoriteQuery);

  if (favoriteDocs.empty) {
    throw new Error("Ce produit n'est pas dans vos favoris");
  }

  // Supprimer le document
  const favoriteDoc = favoriteDocs.docs[0];
  await deleteDoc(doc(db, "favorites", favoriteDoc.id));
}

/**
 * Récupérer tous les favoris d'un utilisateur
 */
export async function getUserFavorites(userId: string): Promise<Favorite[]> {
  const favoritesQuery = query(
    collection(db, "favorites"),
    where("userId", "==", userId)
  );
  const docs = await getDocs(favoritesQuery);

  return docs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Favorite[];
}

/**
 * Vérifier si un produit est dans les favoris de l'utilisateur
 */
export async function isFavorite(productId: string): Promise<boolean> {
  if (!auth.currentUser) {
    return false;
  }

  const userId = auth.currentUser.uid;
  const favoriteQuery = query(
    collection(db, "favorites"),
    where("userId", "==", userId),
    where("productId", "==", productId)
  );
  const docs = await getDocs(favoriteQuery);

  return !docs.empty;
}

/**
 * Récupérer tous les IDs de produits favoris d'un utilisateur
 */
export async function getFavoriteProductIds(userId: string): Promise<string[]> {
  const favorites = await getUserFavorites(userId);
  return favorites.map((fav) => fav.productId);
}

