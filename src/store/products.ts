import { defineStore } from "pinia";
import { fetchProducts } from "../services/productService";
import type { Product } from "../types";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [] as Product[],
    loading: false,
  }),
  actions: {
    async loadProducts() {
      this.loading = true;
      this.products = await fetchProducts();
      this.loading = false;
    },
  },
});




