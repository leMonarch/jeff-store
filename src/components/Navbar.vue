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
                Ajouter impression
              </router-link>
              <router-link
                to="/admin/newsletter"
                class="text-gray-700 hover:text-blue-600"
              >
                Newsletter
              </router-link>
            </template>
            <router-link
              to="/favorites"
              class="text-gray-700 hover:text-blue-600 relative"
            >
              <span class="flex items-center">
                Favoris
                <span
                  v-if="favoritesCount > 0"
                  class="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
                >
                  {{ favoritesCount }}
                </span>
              </span>
            </router-link>
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
import { computed, onMounted } from "vue";
import { useUserStore } from "../store/user";
import { useFavoritesStore } from "../store/favorites";

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();

const user = computed(() => userStore.user);
const userData = computed(() => userStore.userData);
const favoritesCount = computed(() => favoritesStore.favoritesCount);

const logout = () => userStore.logout();

onMounted(() => {
  favoritesStore.initialize();
});
</script>
