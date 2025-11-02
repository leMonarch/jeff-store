<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <div
        class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 mb-12 text-center"
      >
        <h1 class="text-5xl font-bold mb-4">Bienvenue sur Jeff Gallery</h1>
        <p class="text-xl mb-8">
          Découvrez notre sélection d'impressions numériques de qualité
        </p>
        <router-link
          to="/"
          class="btn bg-white text-blue-600 hover:bg-gray-100"
        >
          Découvrir nos impressions numériques
        </router-link>
      </div>

      <div v-if="productsStore.loading" class="text-center py-12">
        <div class="text-gray-500">Chargement...</div>
      </div>

      <div v-else>
        <h2 class="text-3xl font-bold mb-8">
          Impressions numériques populaires
        </h2>
        <ProductList />
      </div>

      <!-- Newsletter Section -->
      <div
        class="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 text-center"
      >
        <h2 class="text-3xl font-bold mb-4">Restez informé</h2>
        <p class="text-lg mb-6">
          Inscrivez-vous à notre newsletter pour être alerté dès qu'une nouvelle
          impression numérique est ajoutée
        </p>
        <form @submit.prevent="handleNewsletterSubmit" class="max-w-md mx-auto">
          <div
            v-if="newsletterError"
            class="bg-red-500 text-white px-4 py-2 rounded mb-4"
          >
            {{ newsletterError }}
          </div>
          <div
            v-if="newsletterSuccess"
            class="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            {{ newsletterSuccess }}
          </div>
          <div class="flex gap-2">
            <input
              v-model="newsletterEmail"
              type="email"
              required
              placeholder="Votre adresse email"
              class="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button
              type="submit"
              :disabled="newsletterSubmitting"
              class="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="newsletterSubmitting">Inscription...</span>
              <span v-else>S'inscrire</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProductsStore } from "../store/products";
import { subscribeToNewsletter } from "../services/newsletterService";
import Navbar from "../components/Navbar.vue";
import ProductList from "../components/ProductList.vue";

const productsStore = useProductsStore();

const newsletterEmail = ref("");
const newsletterSubmitting = ref(false);
const newsletterError = ref<string | null>(null);
const newsletterSuccess = ref<string | null>(null);

async function handleNewsletterSubmit() {
  newsletterError.value = null;
  newsletterSuccess.value = null;
  newsletterSubmitting.value = true;

  try {
    await subscribeToNewsletter(newsletterEmail.value);
    newsletterSuccess.value =
      "Merci ! Vous êtes maintenant inscrit à la newsletter.";
    newsletterEmail.value = "";
  } catch (error: any) {
    newsletterError.value =
      error.message || "Une erreur est survenue lors de l'inscription.";
  } finally {
    newsletterSubmitting.value = false;
  }
}

onMounted(() => {
  productsStore.loadProducts();
});
</script>
