<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-3xl font-bold">
              Ajouter une impression numérique
            </h1>
            <router-link
              to="/admin/newsletter"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Gérer la newsletter →
            </router-link>
          </div>
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
          Impression numérique ajoutée avec succès !
        </div>

        <form @submit.prevent="handleSubmit" class="card space-y-6">
          <!-- Upload d'image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Image de l'impression numérique *
            </label>
            <div class="mt-1 flex items-center space-x-5">
              <input
                type="file"
                accept="image/*"
                @change="handleImageChange"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
            <div v-if="imagePreview" class="mt-4">
              <img
                :src="imagePreview"
                alt="Aperçu"
                class="max-w-xs h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
            <div v-if="uploading" class="mt-2 text-sm text-gray-600">
              Upload en cours...
            </div>
          </div>

          <!-- Nom -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nom de l'impression numérique"
            />
          </div>

          <!-- Description -->
          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description de l'impression numérique"
            ></textarea>
          </div>

          <!-- Prix -->
          <div>
            <label
              for="price"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Prix (€) *
            </label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <!-- Medium -->
          <div>
            <label
              for="medium"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Medium
            </label>
            <input
              id="medium"
              v-model="form.medium"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Impression sur toile, Papier photo premium, etc."
            />
          </div>

          <!-- Dimensions -->
          <div>
            <label
              for="dimensions"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Dimensions
            </label>
            <input
              id="dimensions"
              v-model="form.dimensions"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 30 x 40 cm, 50 x 70 cm, etc."
            />
          </div>

          <!-- Catégorie -->
          <div>
            <label
              for="category"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Catégorie *
            </label>
            <input
              id="category"
              v-model="form.category"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Art moderne, Photographie, Abstraction, etc."
            />
          </div>

          <!-- Stock (optionnel) -->
          <div>
            <label
              for="stock"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Stock disponible
            </label>
            <input
              id="stock"
              v-model.number="form.stock"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Quantité en stock"
            />
          </div>

          <!-- Active -->
          <div class="flex items-center">
            <input
              id="active"
              v-model="form.active"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="active" class="ml-2 block text-sm text-gray-700">
              Impression active (visible sur le site)
            </label>
          </div>

          <!-- Newsletter -->
          <div class="flex items-center">
            <input
              id="sendNewsletter"
              v-model="form.sendNewsletter"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              for="sendNewsletter"
              class="ml-2 block text-sm text-gray-700"
            >
              Envoyer une notification par email aux abonnés de la newsletter
            </label>
          </div>

          <!-- Boutons -->
          <div class="flex space-x-4 pt-4">
            <button
              type="submit"
              :disabled="submitting || uploading"
              class="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting">Ajout en cours...</span>
              <span v-else>Ajouter l'impression numérique</span>
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { uploadImage, addProduct } from "../services/adminService";
import Navbar from "../components/Navbar.vue";

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  name: "",
  description: "",
  price: 0,
  medium: "",
  dimensions: "",
  category: "",
  stock: undefined as number | undefined,
  active: true,
  sendNewsletter: false, // Par défaut, ne pas envoyer la newsletter
});

const selectedImage = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const uploading = ref(false);
const submitting = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

// Vérifier que l'utilisateur est admin (la vérification principale est dans le router)
onMounted(() => {
  if (!userStore.isAuthenticated || !userStore.isAdmin) {
    router.push("/");
  }
});

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedImage.value = target.files[0];

    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(selectedImage.value);
  }
}

async function handleSubmit() {
  if (!selectedImage.value) {
    error.value = "Veuillez sélectionner une image";
    return;
  }

  submitting.value = true;
  error.value = null;
  success.value = false;

  try {
    // Upload de l'image
    uploading.value = true;
    const imageUrl = await uploadImage(selectedImage.value);
    uploading.value = false;

    // Ajouter le produit
    await addProduct({
      name: form.name,
      description: form.description,
      price: form.price,
      medium: form.medium || undefined,
      dimensions: form.dimensions || undefined,
      category: form.category,
      stock: form.stock,
      active: form.active,
      imageUrl: imageUrl,
      sendNewsletter: form.sendNewsletter, // Inclure le choix de newsletter
    });

    success.value = true;

    // Réinitialiser le formulaire après 2 secondes
    setTimeout(() => {
      resetForm();
    }, 2000);
  } catch (err: any) {
    error.value = err.message || "Une erreur est survenue lors de l'ajout";
    uploading.value = false;
  } finally {
    submitting.value = false;
  }
}

function resetForm() {
  form.name = "";
  form.description = "";
  form.price = 0;
  form.medium = "";
  form.dimensions = "";
  form.category = "";
  form.stock = undefined;
  form.active = true;
  form.sendNewsletter = false;
  selectedImage.value = null;
  imagePreview.value = null;
  error.value = null;
  success.value = false;
}
</script>
