<template>
  <div class="card hover:shadow-lg transition-shadow">
    <router-link :to="`/product/${product.id}`">
      <img
        :src="product.imageUrl || product.image"
        :alt="product.name"
        class="w-full h-48 object-cover rounded-t-lg mb-4"
      />
    </router-link>

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
        <button @click="$emit('addToCart')" class="btn btn-primary">
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "../types";
import { formatPrice } from "../utils/formatPrice";

defineProps<{ product: Product }>();
defineEmits<{ addToCart: [] }>();
</script>
