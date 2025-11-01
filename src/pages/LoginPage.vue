<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="flex items-center justify-center px-4 py-8">
      <div class="card w-full max-w-md">
        <h1 class="text-3xl font-bold mb-8 text-center">Connexion</h1>
        <form @submit.prevent="login" class="space-y-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="input"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            required
            class="input"
          />
          <button type="submit" class="btn btn-primary w-full">
            Se connecter
          </button>
        </form>
        <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>

        <div class="text-center mt-6">
          <p class="text-gray-600">
            Pas encore de compte ?
            <router-link to="/register" class="text-blue-600 hover:underline">
              Créer un compte
            </router-link>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import Navbar from "../components/Navbar.vue";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  try {
    await userStore.login(email.value, password.value);
    router.push("/");
  } catch (e: any) {
    error.value = e.message;
  }
};
</script>
