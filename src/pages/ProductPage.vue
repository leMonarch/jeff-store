<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Image cliquable -->
        <div class="relative group cursor-zoom-in" @click="openLightbox">
          <img
            :src="product.imageUrl || product.image"
            :alt="product.name"
            class="w-full h-96 object-cover rounded-lg hover:opacity-90 transition-opacity pointer-events-none"
          />
          <div
            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none"
          >
            <div class="text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg text-sm">
              {{ $t('product.clickToZoom') }}
            </div>
          </div>
        </div>
        <div>
          <h1 class="text-4xl font-bold mb-4">{{ product.name }}</h1>
          <div class="text-3xl text-blue-600 font-bold mb-6">
            {{ formatPrice(product.price) }}
          </div>

          <div class="mb-4 text-sm text-gray-600 space-y-2">
            <div v-if="product.medium" class="flex items-center">
              <span class="font-semibold mr-2">{{ $t('product.medium') }}:</span>
              <span>{{ product.medium }}</span>
            </div>
            <div v-if="product.dimensions" class="flex items-center">
              <span class="font-semibold mr-2">{{ $t('product.dimensions') }}:</span>
              <span>{{ product.dimensions }}</span>
            </div>
          </div>

          <p class="text-gray-600 mb-6">{{ product.description }}</p>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-gray-500">{{ $t('product.notFound') }}</p>
      </div>
    </main>

    <!-- Lightbox avec zoom -->
    <div
      v-if="isLightboxOpen"
      class="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
      @click.self="closeLightbox"
      @wheel.prevent="handleWheel"
    >
      <!-- Bouton fermer -->
      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Fermer"
      >
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Contrôles de zoom -->
      <div
        class="absolute top-4 left-4 flex flex-col gap-2 z-10"
        @click.stop
      >
        <button
          @click="zoomIn"
          class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-all"
          :aria-label="$t('lightbox.zoomIn')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <button
          @click="zoomOut"
          class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-all"
          :aria-label="$t('lightbox.zoomOut')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        </button>
        <button
          @click="resetZoom"
          class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-all text-xs"
          :aria-label="$t('lightbox.reset')"
        >
          {{ $t('lightbox.reset') }}
        </button>
        <div class="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm text-center">
          {{ Math.round(zoomLevel * 100) }}%
        </div>
      </div>

      <!-- Image zoomable -->
      <div
        class="relative max-w-[90vw] max-h-[90vh] overflow-hidden"
        @mousedown="startPan"
        @mousemove="pan"
        @mouseup="endPan"
        @mouseleave="endPan"
      >
        <img
          :src="product?.imageUrl || product?.image"
          :alt="product?.name"
          :style="{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
            maxWidth: '100%',
            maxHeight: '90vh',
            cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
          }"
          @click.stop
          draggable="false"
        />
      </div>

      <!-- Instructions -->
      <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-lg"
      >
        <p>{{ $t('lightbox.instructions') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useProductsStore } from "../store/products";
import { formatPrice } from "../utils/formatPrice";
import Navbar from "../components/Navbar.vue";

const { t: $t } = useI18n();

const route = useRoute();
const productsStore = useProductsStore();

const product = computed(() =>
  productsStore.products.find((p) => p.id === route.params.id)
);

// Lightbox state
const isLightboxOpen = ref(false);
const zoomLevel = ref(1);
const isPanning = ref(false);
const panStart = ref({ x: 0, y: 0 });
const panOffset = ref({ x: 0, y: 0 });

// Charger le produit si nécessaire et configurer les événements clavier
let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

onMounted(async () => {
  if (!product.value) {
    await productsStore.loadProducts();
  }

  // Fermer avec Escape
  escapeHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isLightboxOpen.value) {
      closeLightbox();
    }
  };
  window.addEventListener("keydown", escapeHandler);
});

onUnmounted(() => {
  if (escapeHandler) {
    window.removeEventListener("keydown", escapeHandler);
  }
});

// Fonctions lightbox
function openLightbox() {
  isLightboxOpen.value = true;
  zoomLevel.value = 1;
  panOffset.value = { x: 0, y: 0 };
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  isLightboxOpen.value = false;
  zoomLevel.value = 1;
  panOffset.value = { x: 0, y: 0 };
  document.body.style.overflow = "";
}

function zoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value + 0.25, 5);
}

function zoomOut() {
  if (zoomLevel.value <= 1) {
    panOffset.value = { x: 0, y: 0 };
  }
  zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5);
}

function resetZoom() {
  zoomLevel.value = 1;
  panOffset.value = { x: 0, y: 0 };
}

// Gestion de la molette pour zoomer
function handleWheel(event: WheelEvent) {
  event.preventDefault();
  if (event.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
}

// Gestion du pan (déplacer l'image zoomée)
function startPan(event: MouseEvent) {
  if (zoomLevel.value > 1) {
    isPanning.value = true;
    panStart.value = { x: event.clientX - panOffset.value.x, y: event.clientY - panOffset.value.y };
  }
}

function pan(event: MouseEvent) {
  if (isPanning.value && zoomLevel.value > 1) {
    panOffset.value = {
      x: event.clientX - panStart.value.x,
      y: event.clientY - panStart.value.y,
    };
  }
}

function endPan() {
  isPanning.value = false;
}
</script>
