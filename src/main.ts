import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import { useUserStore } from "./store/user";
import { useFavoritesStore } from "./store/favorites";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize auth state
const userStore = useUserStore();
userStore.initialize();

// Initialize favorites store
const favoritesStore = useFavoritesStore();
favoritesStore.initialize();

app.mount("#app");
