<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <router-link to="/" class="text-2xl font-bold text-blue-600">
          Mon Store
        </router-link>

        <div class="flex items-center space-x-6">
          <router-link
            to="/cart"
            class="relative text-gray-700 hover:text-blue-600"
          >
            Panier
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartCount }}
            </span>
          </router-link>

          <template v-if="user">
            <span class="text-gray-700">{{
              userData?.displayName || user.email
            }}</span>
            <button @click="logout" class="text-gray-700 hover:text-blue-600">
              Déconnexion
            </button>
          </template>
          <router-link v-else to="/login" class="btn btn-primary">
            Connexion
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import type { CartItem } from "../types/CartItem";

const cartStore = useCartStore();
const userStore = useUserStore();

const cartCount = computed(() =>
  cartStore.items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  )
);

const user = computed(() => userStore.user);
const userData = computed(() => userStore.userData);

const logout = () => userStore.logout();
</script>
