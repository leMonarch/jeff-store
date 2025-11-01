<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="flex items-center justify-center px-4 py-8">
      <div class="card w-full max-w-md">
        <h1 class="text-3xl font-bold mb-8 text-center">Créer un compte</h1>
        <form @submit.prevent="register" class="space-y-4">
          <input
            v-model="displayName"
            type="text"
            placeholder="Nom complet"
            required
            class="input"
          />
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
            placeholder="Mot de passe (min. 6 caractères)"
            required
            minlength="6"
            class="input"
          />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirmer le mot de passe"
            required
            class="input"
          />

          <div v-if="passwordMismatch" class="text-sm text-red-600">
            Les mots de passe ne correspondent pas
          </div>

          <button
            type="submit"
            :disabled="passwordMismatch"
            class="btn btn-primary w-full"
          >
            S'inscrire
          </button>
        </form>

        <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>

        <div class="text-center mt-6">
          <p class="text-gray-600">
            Déjà un compte ?
            <router-link to="/login" class="text-blue-600 hover:underline">
              Se connecter
            </router-link>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import Navbar from "../components/Navbar.vue";

const router = useRouter();
const userStore = useUserStore();

const displayName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");

const passwordMismatch = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
  );
});

const register = async () => {
  if (passwordMismatch.value) return;

  error.value = "";
  try {
    await userStore.register(email.value, password.value, displayName.value);
    router.push("/");
  } catch (e: any) {
    error.value = e.message;
  }
};
</script>


