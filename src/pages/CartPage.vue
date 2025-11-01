<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Panier</h1>

      <div v-if="cartStore.items.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-xl mb-4">Votre panier est vide</p>
        <router-link to="/" class="btn btn-primary"
          >Continuer vos achats</router-link
        >
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-4">
          <CartItem
            v-for="item in cartStore.items"
            :key="item.product.id"
            :item="item"
            @remove="cartStore.removeItem(item.product.id)"
          />
        </div>

        <div class="card">
          <h2 class="text-2xl font-bold mb-4">Récapitulatif</h2>
          <div class="flex justify-between font-bold text-xl border-t pt-4">
            <span>Total</span>
            <span>{{ formatPrice(cartStore.total) }}</span>
          </div>
          <button class="btn btn-primary w-full mt-6">
            Passer la commande
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "../store/cart";
import { formatPrice } from "../utils/formatPrice";
import Navbar from "../components/Navbar.vue";
import CartItem from "../components/CartItem.vue";

const cartStore = useCartStore();
</script>
