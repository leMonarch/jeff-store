<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <div class="mb-6">
          <router-link
            to="/admin"
            class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Retour à l'ajout d'impressions
          </router-link>
          <h1 class="text-3xl font-bold mb-2">Créer et envoyer une newsletter</h1>
          <p class="text-gray-600">
            Envoyez un email personnalisé à tous les abonnés de la newsletter
          </p>
        </div>

        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {{ error }}
        </div>

        <div
          v-if="success"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
        >
          Newsletter envoyée avec succès à {{ subscriberCount }} abonnés !
        </div>

        <form @submit.prevent="handleSubmit" class="card space-y-6">
          <!-- Sujet -->
          <div>
            <label
              for="subject"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Sujet de l'email *
            </label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Nouvelle collection disponible, Promotion spéciale, etc."
            />
          </div>

          <!-- Contenu HTML -->
          <div>
            <label
              for="content"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Contenu de l'email *
            </label>
            <textarea
              id="content"
              v-model="form.content"
              required
              rows="10"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Vous pouvez utiliser du HTML pour formater votre email. Exemple :&#10;&#10;&lt;h2&gt;Bonjour !&lt;/h2&gt;&#10;&lt;p&gt;Nous avons le plaisir de vous annoncer...&lt;/p&gt;&#10;&lt;a href='https://votre-site.com'&gt;Visitez notre site&lt;/a&gt;"
            ></textarea>
            <p class="mt-2 text-sm text-gray-500">
              Le HTML est accepté. Utilisez &lt;h1&gt;, &lt;p&gt;, &lt;a&gt;,
              &lt;img&gt;, etc.
            </p>
          </div>

          <!-- Aperçu du nombre d'abonnés -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-900">
                  Nombre d'abonnés actifs
                </p>
                <p class="text-2xl font-bold text-blue-600">
                  {{ subscriberCount }}
                </p>
              </div>
              <button
                type="button"
                @click="refreshSubscriberCount"
                :disabled="loadingCount"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {{ loadingCount ? "Chargement..." : "Actualiser" }}
              </button>
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex space-x-4 pt-4">
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting">Envoi en cours...</span>
              <span v-else>Envoyer la newsletter</span>
            </button>
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Réinitialiser
            </button>
          </div>
        </form>

        <!-- Historique récent (optionnel) -->
        <div class="mt-8 card">
          <h2 class="text-xl font-bold mb-4">Comment ça fonctionne ?</h2>
          <ul class="list-disc list-inside space-y-2 text-gray-600">
            <li>
              Remplissez le sujet et le contenu de votre email (HTML accepté)
            </li>
            <li>L'email sera envoyé à tous les abonnés actifs de la newsletter</li>
            <li>
              Vous pouvez envoyer une newsletter à tout moment, sans avoir besoin
              d'ajouter une impression
            </li>
            <li>
              L'envoi est géré par Firebase Cloud Functions (peut prendre
              quelques secondes)
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { sendManualNewsletter, getSubscriberCount } from "../services/adminService";
import Navbar from "../components/Navbar.vue";

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  subject: "",
  content: "",
});

const submitting = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const subscriberCount = ref(0);
const loadingCount = ref(false);

// Vérifier que l'utilisateur est admin
onMounted(async () => {
  if (!userStore.user || userStore.userData?.role !== "admin") {
    router.push("/");
    return;
  }

  await refreshSubscriberCount();
});

async function refreshSubscriberCount() {
  loadingCount.value = true;
  try {
    subscriberCount.value = await getSubscriberCount();
  } catch (err: any) {
    console.error("Erreur lors du chargement du nombre d'abonnés:", err);
  } finally {
    loadingCount.value = false;
  }
}

async function handleSubmit() {
  if (!form.subject || !form.content) {
    error.value = "Veuillez remplir tous les champs";
    return;
  }

  submitting.value = true;
  error.value = null;
  success.value = false;

  try {
    await sendManualNewsletter({
      subject: form.subject,
      content: form.content,
    });

    success.value = true;
    await refreshSubscriberCount();

    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      resetForm();
    }, 3000);
  } catch (err: any) {
    error.value = err.message || "Une erreur est survenue lors de l'envoi";
  } finally {
    submitting.value = false;
  }
}

function resetForm() {
  form.subject = "";
  form.content = "";
  error.value = null;
  success.value = false;
}
</script>


