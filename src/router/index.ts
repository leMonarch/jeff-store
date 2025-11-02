import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import ProductPage from "../pages/ProductPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import AdminPage from "../pages/AdminPage.vue";
import NewsletterAdminPage from "../pages/NewsletterAdminPage.vue";
import FavoritesPage from "../pages/FavoritesPage.vue";
import { useUserStore } from "../store/user";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/product/:id", component: ProductPage },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
    {
      path: "/favorites",
      component: FavoritesPage,
      beforeEnter: (_to, _from, next) => {
        const userStore = useUserStore();
        if (!userStore.user) {
          next("/login");
        } else {
          next();
        }
      },
    },
    {
      path: "/admin",
      component: AdminPage,
      beforeEnter: (_to, _from, next) => {
        const userStore = useUserStore();
        if (!userStore.user) {
          next("/login");
        } else if (userStore.userData?.role !== "admin") {
          next("/");
        } else {
          next();
        }
      },
    },
    {
      path: "/admin/newsletter",
      component: NewsletterAdminPage,
      beforeEnter: (_to, _from, next) => {
        const userStore = useUserStore();
        if (!userStore.user) {
          next("/login");
        } else if (userStore.userData?.role !== "admin") {
          next("/");
        } else {
          next();
        }
      },
    },
  ],
});

export default router;
