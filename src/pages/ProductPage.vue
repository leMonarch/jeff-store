<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          :src="product.imageUrl || product.image"
          :alt="product.name"
          class="w-full h-96 object-cover rounded-lg"
        />
        <div>
          <h1 class="text-4xl font-bold mb-4">{{ product.name }}</h1>
          <div class="text-3xl text-blue-600 font-bold mb-6">
            {{ formatPrice(product.price) }}
          </div>

          <div class="mb-4 text-sm text-gray-600 space-y-2">
            <div v-if="product.medium" class="flex items-center">
              <span class="font-semibold mr-2">Medium:</span>
              <span>{{ product.medium }}</span>
            </div>
            <div v-if="product.dimensions" class="flex items-center">
              <span class="font-semibold mr-2">Dimensions:</span>
              <span>{{ product.dimensions }}</span>
            </div>
          </div>

          <p class="text-gray-600 mb-6">{{ product.description }}</p>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-gray-500">Produit non trouvé</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useProductsStore } from "../store/products";
import { formatPrice } from "../utils/formatPrice";
import Navbar from "../components/Navbar.vue";

const route = useRoute();
const productsStore = useProductsStore();

const product = productsStore.products.find((p) => p.id === route.params.id);
</script>
