<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="cartStore.addItem(product)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useProductsStore } from "../store/products";
import { useCartStore } from "../store/cart";
import ProductCard from "./ProductCard.vue";

const productsStore = useProductsStore();
const cartStore = useCartStore();

const products = computed(() => productsStore.products);
</script>

<style scoped>
/* Styles are now handled by Tailwind classes */
</style>
