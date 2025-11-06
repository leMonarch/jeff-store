<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="flex items-center justify-center px-4 py-8">
      <div class="card w-full max-w-md">
        <h1 class="text-3xl font-bold mb-8 text-center">{{ $t('auth.register') }}</h1>
        <form @submit.prevent="register" class="space-y-4">
          <input
            v-model="displayName"
            type="text"
            :placeholder="$t('auth.namePlaceholder')"
            required
            class="input"
          />
          <input
            v-model="email"
            type="email"
            :placeholder="$t('auth.emailPlaceholder')"
            required
            class="input"
          />
          <input
            v-model="password"
            type="password"
            :placeholder="$t('auth.passwordPlaceholder') + ' (min. 6 caractères)'"
            required
            minlength="6"
            class="input"
          />
          <input
            v-model="confirmPassword"
            type="password"
            :placeholder="$t('auth.passwordPlaceholder')"
            required
            class="input"
          />

          <div v-if="passwordMismatch" class="text-sm text-red-600">
            {{ $t('auth.passwordMismatch') || 'Les mots de passe ne correspondent pas' }}
          </div>

          <button
            type="submit"
            :disabled="passwordMismatch"
            class="btn btn-primary w-full"
          >
            {{ $t('auth.register') }}
          </button>
        </form>

        <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>

        <div class="text-center mt-6">
          <p class="text-gray-600">
            {{ $t('auth.hasAccount') }}
            <router-link to="/login" class="text-blue-600 hover:underline">
              {{ $t('auth.login') }}
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
import { useI18n } from "vue-i18n";
import { useUserStore } from "../store/user";
import Navbar from "../components/Navbar.vue";

const { t: $t } = useI18n();

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




