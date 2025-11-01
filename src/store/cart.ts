import { defineStore } from "pinia";
import type { CartItem, Product } from "../types";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    total() {
      return this.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
    },
  },
  actions: {
    addItem(product: Product) {
      const existing = this.items.find(
        (item) => item.product.id === product.id
      );
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ product, quantity: 1 });
      }
    },
    removeItem(productId: string) {
      this.items = this.items.filter((item) => item.product.id !== productId);
    },
  },
});


