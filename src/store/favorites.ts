import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  getUserFavorites,
  getFavoriteProductIds,
  addToFavorites,
  removeFromFavorites,
} from "../services/favoritesService";
import type { Favorite } from "../services/favoritesService";
import { useUserStore } from "./user";

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref<Favorite[]>([]);
  const favoriteProductIds = ref<string[]>([]);
  const loading = ref(false);

  // Computed
  const favoritesCount = computed(() => favorites.value.length);

  // Actions
  async function loadFavorites() {
    const userStore = useUserStore();
    if (!userStore.isAuthenticated) {
      favorites.value = [];
      favoriteProductIds.value = [];
      return;
    }

    loading.value = true;
    try {
      favorites.value = await getUserFavorites();
      favoriteProductIds.value = await getFavoriteProductIds();
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
    const userStore = useUserStore();
    if (!userStore.isAuthenticated) {
      throw new Error("Vous devez être connecté pour ajouter aux favoris");
    }

    try {
      const currentlyFavorite = favoriteProductIds.value.includes(productId);

      if (currentlyFavorite) {
        await removeFromFavorites(productId);
        // Retirer de la liste locale
        favorites.value = favorites.value.filter(
          (fav) => fav.productId.toString() !== productId
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
    const userStore = useUserStore();
    // Charger les favoris si l'utilisateur est connecté
    if (userStore.isAuthenticated) {
      loadFavorites();
    }
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

