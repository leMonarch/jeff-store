<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <router-link to="/" class="text-2xl font-bold text-blue-600">
          Jeff Gallery
        </router-link>

        <div class="flex items-center space-x-6">
          <template v-if="user">
            <template v-if="userData?.role === 'admin'">
              <router-link
                to="/admin"
                class="text-gray-700 hover:text-blue-600"
              >
                {{ $t('nav.addProduct') }}
              </router-link>
              <router-link
                to="/admin/newsletter"
                class="text-gray-700 hover:text-blue-600"
              >
                {{ $t('nav.newsletter') }}
              </router-link>
            </template>
            <router-link
              to="/favorites"
              class="text-gray-700 hover:text-blue-600 relative"
            >
              <span class="flex items-center">
                {{ $t('nav.favorites') }}
                <span
                  v-if="favoritesCount > 0"
                  class="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
                >
                  {{ favoritesCount }}
                </span>
              </span>
            </router-link>
            <span class="text-gray-700">{{
              userData?.name || user.email
            }}</span>
            
            <!-- Sélecteur de langue -->
            <div class="flex items-center space-x-2">
              <button
                @click="setLocale('fr')"
                :class="[
                  'px-3 py-1 rounded text-sm font-medium transition-colors',
                  currentLocale === 'fr'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
                :title="$t('nav.french') || 'Français'"
              >
                FR
              </button>
              <button
                @click="setLocale('en')"
                :class="[
                  'px-3 py-1 rounded text-sm font-medium transition-colors',
                  currentLocale === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
                :title="$t('nav.english') || 'English'"
              >
                EN
              </button>
            </div>
            
            <button @click="logout" class="text-gray-700 hover:text-blue-600">
              {{ $t('nav.logout') }}
            </button>
          </template>
          <template v-else>
            <!-- Sélecteur de langue pour utilisateurs non connectés -->
            <div class="flex items-center space-x-2">
              <button
                @click="setLocale('fr')"
                :class="[
                  'px-3 py-1 rounded text-sm font-medium transition-colors',
                  currentLocale === 'fr'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
                :title="$t('nav.french') || 'Français'"
              >
                FR
              </button>
              <button
                @click="setLocale('en')"
                :class="[
                  'px-3 py-1 rounded text-sm font-medium transition-colors',
                  currentLocale === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
                :title="$t('nav.english') || 'English'"
              >
                EN
              </button>
            </div>
            <router-link to="/login" class="btn btn-primary">
              {{ $t('nav.login') }}
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore } from "../store/user";
import { useFavoritesStore } from "../store/favorites";
import { useLocaleStore } from "../store/locale";
import { useProductsStore } from "../store/products";

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const localeStore = useLocaleStore();
const productsStore = useProductsStore();

const user = computed(() => userStore.user);
const userData = computed(() => userStore.userData);
const favoritesCount = computed(() => favoritesStore.favoritesCount);
const currentLocale = computed(() => localeStore.currentLocale);

const logout = () => userStore.logout();

const setLocale = (locale: "fr" | "en") => {
  localeStore.setLocale(locale);
  // Recharger les produits avec la nouvelle langue
  productsStore.loadProducts();
};

onMounted(() => {
  favoritesStore.initialize();
  localeStore.initialize();
});
</script>
