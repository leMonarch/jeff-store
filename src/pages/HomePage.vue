<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <div
        class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 mb-12 text-center"
      >
        <h1 class="text-5xl font-bold mb-4">Bienvenue sur Mon Store</h1>
        <p class="text-xl mb-8">
          Découvrez notre sélection de produits de qualité
        </p>
        <router-link
          to="/"
          class="btn bg-white text-blue-600 hover:bg-gray-100"
        >
          Découvrir nos produits
        </router-link>
      </div>

      <div v-if="productsStore.loading" class="text-center py-12">
        <div class="text-gray-500">Chargement...</div>
      </div>

      <div v-else>
        <h2 class="text-3xl font-bold mb-8">Produits populaires</h2>
        <ProductList />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useProductsStore } from "../store/products";
import Navbar from "../components/Navbar.vue";
import ProductList from "../components/ProductList.vue";

const productsStore = useProductsStore();

onMounted(() => {
  productsStore.loadProducts();
});
</script>
