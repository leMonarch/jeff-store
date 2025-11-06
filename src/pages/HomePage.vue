<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <div
        class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 mb-12 text-center"
      >
        <h1 class="text-5xl font-bold mb-4">{{ $t('common.welcome') }}</h1>
        <p class="text-xl mb-8">
          {{ $t('common.subtitle') }}
        </p>
        <router-link
          to="/"
          class="btn bg-white text-blue-600 hover:bg-gray-100"
        >
          {{ $t('common.subtitle') }}
        </router-link>
      </div>

      <div v-if="productsStore.loading" class="text-center py-12">
        <div class="text-gray-500">{{ $t('product.loading') }}</div>
      </div>

      <div v-else>
        <h2 class="text-3xl font-bold mb-8">
          {{ $t('common.popular') }}
        </h2>
        <ProductList />
      </div>

      <!-- Newsletter Section -->
      <div
        class="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 text-center"
      >
        <h2 class="text-3xl font-bold mb-4">{{ $t('common.newsletter.title') }}</h2>
        <p class="text-lg mb-6">
          {{ $t('common.newsletter.description') }}
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
              :placeholder="$t('auth.emailPlaceholder')"
              class="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button
              type="submit"
              :disabled="newsletterSubmitting"
              class="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="newsletterSubmitting">{{ $t('common.newsletter.subscribing') }}</span>
              <span v-else>{{ $t('common.newsletter.subscribe') }}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useProductsStore } from "../store/products";
import { subscribeToNewsletter } from "../services/newsletterService";
import Navbar from "../components/Navbar.vue";
import ProductList from "../components/ProductList.vue";

const { t: $t } = useI18n();

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
    newsletterSuccess.value = $t('common.newsletter.success');
    newsletterEmail.value = "";
  } catch (error: any) {
    newsletterError.value =
      error.message || $t('common.newsletter.error');
  } finally {
    newsletterSubmitting.value = false;
  }
}

onMounted(() => {
  productsStore.loadProducts();
});
</script>
