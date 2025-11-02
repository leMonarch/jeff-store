<template>
  <div class="card hover:shadow-lg transition-shadow relative">
    <div class="relative">
      <router-link :to="`/product/${product.id}`">
        <img
          :src="product.imageUrl || product.image"
          :alt="product.name"
          class="w-full h-48 object-cover rounded-t-lg"
        />
      </router-link>
      <!-- Bouton Favoris -->
      <button
        v-if="user"
        @click.stop="handleToggleFavorite"
        :disabled="toggling"
        class="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all disabled:opacity-50"
        :title="
          isProductFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
        "
      >
        <svg
          v-if="isProductFavorite"
          class="w-6 h-6 text-red-500 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
        <svg
          v-else
          class="w-6 h-6 text-gray-400 hover:text-red-500 fill-none stroke-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </button>
    </div>

    <div>
      <h3 class="text-xl font-semibold mb-2">{{ product.name }}</h3>
      <p class="text-gray-600 text-sm mb-2 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="mb-4 text-xs text-gray-500 space-y-1">
        <div v-if="product.medium" class="flex items-center">
          <span class="font-medium">Medium:</span>
          <span class="ml-2">{{ product.medium }}</span>
        </div>
        <div v-if="product.dimensions" class="flex items-center">
          <span class="font-medium">Dimensions:</span>
          <span class="ml-2">{{ product.dimensions }}</span>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-2xl font-bold text-blue-600">{{
          formatPrice(product.price)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { useFavoritesStore } from "../store/favorites";
import type { Product } from "../types";
import { formatPrice } from "../utils/formatPrice";

const props = defineProps<{ product: Product }>();

const router = useRouter();
const userStore = useUserStore();
const favoritesStore = useFavoritesStore();

const user = computed(() => userStore.user);
const isProductFavorite = computed(() =>
  favoritesStore.checkIsProductFavorite(props.product.id)
);
const toggling = ref(false);

async function handleToggleFavorite() {
  if (!user.value) {
    router.push("/login");
    return;
  }

  toggling.value = true;
  try {
    await favoritesStore.toggleFavorite(props.product.id);
  } catch (error: any) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    alert(error.message || "Une erreur est survenue");
  } finally {
    toggling.value = false;
  }
}
</script>
