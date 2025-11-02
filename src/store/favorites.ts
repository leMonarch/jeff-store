import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  getUserFavorites,
  getFavoriteProductIds,
  addToFavorites,
  removeFromFavorites,
  isFavorite as checkIsFavorite,
} from "../services/favoritesService";
import type { Favorite } from "../services/favoritesService";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref<Favorite[]>([]);
  const favoriteProductIds = ref<string[]>([]);
  const loading = ref(false);

  // Computed
  const favoritesCount = computed(() => favorites.value.length);

  // Actions
  async function loadFavorites() {
    if (!auth.currentUser) {
      favorites.value = [];
      favoriteProductIds.value = [];
      return;
    }

    loading.value = true;
    try {
      const userId = auth.currentUser.uid;
      favorites.value = await getUserFavorites(userId);
      favoriteProductIds.value = await getFavoriteProductIds(userId);
    } catch (error) {
      console.error(
        "[FavoritesStore] Erreur lors du chargement des favoris:",
        error
      );
      favorites.value = [];
      favoriteProductIds.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function toggleFavorite(productId: string): Promise<boolean> {
    if (!auth.currentUser) {
      throw new Error("Vous devez être connecté pour ajouter aux favoris");
    }

    try {
      const currentlyFavorite = favoriteProductIds.value.includes(productId);

      if (currentlyFavorite) {
        await removeFromFavorites(productId);
        // Retirer de la liste locale
        favorites.value = favorites.value.filter(
          (fav) => fav.productId !== productId
        );
        favoriteProductIds.value = favoriteProductIds.value.filter(
          (id) => id !== productId
        );
        return false;
      } else {
        await addToFavorites(productId);
        // Ajouter à la liste locale
        favoriteProductIds.value.push(productId);
        await loadFavorites(); // Recharger pour avoir toutes les données
        return true;
      }
    } catch (error: any) {
      console.error("[FavoritesStore] Erreur lors du toggle favoris:", error);
      throw error;
    }
  }

  function checkIsProductFavorite(productId: string): boolean {
    return favoriteProductIds.value.includes(productId);
  }

  // Initialiser le store
  function initialize() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadFavorites();
      } else {
        favorites.value = [];
        favoriteProductIds.value = [];
      }
    });
  }

  return {
    favorites,
    favoriteProductIds,
    loading,
    favoritesCount,
    loadFavorites,
    toggleFavorite,
    checkIsProductFavorite,
    initialize,
  };
});

