<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-3xl font-bold">
              {{ $t('admin.title') }}
            </h1>
            <router-link
              to="/admin/newsletter"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {{ $t('admin.manageNewsletter') }} →
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
          {{ $t('admin.form.success') }}
        </div>

        <form @submit.prevent="handleSubmit" class="card space-y-6">
          <!-- Upload d'image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('product.uploadImage') }} *
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

          <!-- Onglets pour les traductions -->
          <div>
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <button
                  type="button"
                  @click="activeTab = 'fr'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'fr'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Français
                </button>
                <button
                  type="button"
                  @click="activeTab = 'en'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'en'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  English
                </button>
              </nav>
            </div>

            <!-- Contenu Français -->
            <div v-show="activeTab === 'fr'" class="mt-6 space-y-4">
              <div>
                <label
                  for="nameFr"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t('product.nameFr') }} *
                </label>
                <input
                  id="nameFr"
                  v-model="form.nameFr"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="$t('product.name')"
                />
              </div>

              <div>
                <label
                  for="descriptionFr"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t('product.descriptionFr') }}
                </label>
                <textarea
                  id="descriptionFr"
                  v-model="form.descriptionFr"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="$t('product.description')"
                ></textarea>
              </div>

              <div>
                <label
                  for="categoryFr"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t('product.categoryFr') }} *
                </label>
                <input
                  id="categoryFr"
                  v-model="form.categoryFr"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="$t('product.category')"
                />
              </div>

              <div>
                <label
                  for="mediumFr"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t('product.mediumFr') }}
                </label>
                <input
                  id="mediumFr"
                  v-model="form.mediumFr"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="$t('product.medium')"
                />
              </div>
            </div>

            <!-- Contenu Anglais -->
            <div v-show="activeTab === 'en'" class="mt-6 space-y-4">
              <div>
                <label
                  for="nameEn"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t('product.nameEn') }} *
                </label>
                <input
                  id="nameEn"
                  v-model="form.nameEn"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="$t('product.name')"
                />
              </div>

              <div>
                <label
                  for="descriptionEn"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t('product.descriptionEn') }}
                </label>
                <textarea
                  id="descriptionEn"
                  v-model="form.descriptionEn"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="$t('product.description')"
                ></textarea>
              </div>

              <div>
                <label
                  for="categoryEn"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t('product.categoryEn') }} *
                </label>
                <input
                  id="categoryEn"
                  v-model="form.categoryEn"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="$t('product.category')"
                />
              </div>

              <div>
                <label
                  for="mediumEn"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t('product.mediumEn') }}
                </label>
                <input
                  id="mediumEn"
                  v-model="form.mediumEn"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="$t('product.medium')"
                />
              </div>
            </div>
          </div>

          <!-- Prix -->
          <div>
            <label
              for="price"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              {{ $t('product.price') }} (€) *
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

          <!-- Dimensions -->
          <div>
            <label
              for="dimensions"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              {{ $t('product.dimensions') }}
            </label>
            <input
              id="dimensions"
              v-model="form.dimensions"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 30 x 40 cm, 50 x 70 cm, etc."
            />
          </div>

          <!-- Stock (optionnel) -->
          <div>
            <label
              for="stock"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              {{ $t('product.stock') }}
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
              {{ $t('product.active') }} ({{ $t('product.active') }})
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
              {{ $t('product.sendNewsletter') }}
            </label>
          </div>

          <!-- Boutons -->
          <div class="flex space-x-4 pt-4">
            <button
              type="submit"
              :disabled="submitting || uploading"
              class="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting">{{ $t('admin.form.submitting') || 'Ajout en cours...' }}</span>
              <span v-else>{{ $t('product.submit') }}</span>
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

const activeTab = ref<"fr" | "en">("fr");

const form = reactive({
  // Traductions françaises
  nameFr: "",
  descriptionFr: "",
  categoryFr: "",
  mediumFr: "",
  // Traductions anglaises
  nameEn: "",
  descriptionEn: "",
  categoryEn: "",
  mediumEn: "",
  // Champs communs
  price: 0,
  dimensions: "",
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

  // Validation des champs requis
  if (!form.nameFr || !form.nameEn || !form.categoryFr || !form.categoryEn) {
    error.value = "Veuillez remplir tous les champs requis (nom et catégorie en FR et EN)";
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

    // Ajouter le produit avec les traductions
    await addProduct({
      nameFr: form.nameFr,
      descriptionFr: form.descriptionFr || undefined,
      categoryFr: form.categoryFr,
      mediumFr: form.mediumFr || undefined,
      nameEn: form.nameEn,
      descriptionEn: form.descriptionEn || undefined,
      categoryEn: form.categoryEn,
      mediumEn: form.mediumEn || undefined,
      price: form.price,
      dimensions: form.dimensions || undefined,
      stock: form.stock,
      active: form.active,
      imageUrl: imageUrl,
      sendNewsletter: form.sendNewsletter,
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
  form.nameFr = "";
  form.descriptionFr = "";
  form.categoryFr = "";
  form.mediumFr = "";
  form.nameEn = "";
  form.descriptionEn = "";
  form.categoryEn = "";
  form.mediumEn = "";
  form.price = 0;
  form.dimensions = "";
  form.stock = undefined;
  form.active = true;
  form.sendNewsletter = false;
  selectedImage.value = null;
  imagePreview.value = null;
  error.value = null;
  success.value = false;
  activeTab.value = "fr";
}
</script>
