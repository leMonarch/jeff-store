import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import { useUserStore } from "./store/user";
import { useFavoritesStore } from "./store/favorites";
import { useLocaleStore } from "./store/locale";
import i18n from "./i18n";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

// Initialize auth state
const userStore = useUserStore();
userStore.initialize();

// Initialize favorites store
const favoritesStore = useFavoritesStore();
favoritesStore.initialize();

// Initialize locale store
const localeStore = useLocaleStore();
localeStore.initialize();

app.mount("#app");
