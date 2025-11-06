<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">Mes Favoris</h1>

        <div v-if="!user" class="card text-center py-12">
          <p class="text-gray-600 mb-4">
            Vous devez être connecté pour voir vos favoris
          </p>
          <router-link to="/login" class="btn btn-primary">
            Se connecter
          </router-link>
        </div>

        <div v-else-if="favoritesStore.loading" class="text-center py-12">
          <div class="text-gray-500">Chargement de vos favoris...</div>
        </div>

        <div
          v-else-if="favoriteProducts.length === 0"
          class="card text-center py-12"
        >
          <svg
            class="w-24 h-24 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p class="text-gray-600 mb-4">Vous n'avez pas encore de favoris</p>
          <router-link to="/" class="btn btn-primary">
            Découvrir les impressions
          </router-link>
        </div>

        <div v-else>
          <div class="mb-4 text-gray-600">
            {{ favoriteProducts.length }}
            {{
              favoriteProducts.length === 1
                ? "impression favorite"
                : "impressions favorites"
            }}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in favoriteProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore } from "../store/user";
import { useFavoritesStore } from "../store/favorites";
import { useProductsStore } from "../store/products";
import Navbar from "../components/Navbar.vue";
import ProductCard from "../components/ProductCard.vue";

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const productsStore = useProductsStore();

const user = computed(() => userStore.user);

const favoriteProducts = computed(() => {
  // Les favoris incluent déjà les produits complets depuis l'API
  return favoritesStore.favorites.map((fav) => ({
    ...fav.product,
    id: fav.product.id.toString(),
  }));
});

onMounted(async () => {
  await productsStore.loadProducts();
  if (user.value) {
    await favoritesStore.loadFavorites();
  }
});
</script>

