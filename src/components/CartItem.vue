<template>
  <div class="card flex items-center space-x-4">
    <img
      :src="item.product.imageUrl || item.product.image"
      :alt="item.product.name"
      class="w-24 h-24 object-cover rounded"
    />
    <div class="flex-1">
      <h4 class="font-semibold">{{ item.product.name }}</h4>
      <p class="text-gray-600">{{ formatPrice(item.product.price) }}</p>
    </div>
    <div class="flex items-center space-x-2">
      <span>{{ item.quantity }}</span>
    </div>
    <p class="font-bold">
      {{ formatPrice(item.product.price * item.quantity) }}
    </p>
    <button @click="$emit('remove')" class="btn btn-danger">Supprimer</button>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from "../types";
import { formatPrice } from "../utils/formatPrice";

defineProps<{ item: CartItem }>();
defineEmits<{ remove: [] }>();
</script>
