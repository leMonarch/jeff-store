import { defineStore } from "pinia";
import { authService, type User } from "../services/authService";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    userData: null as User | null,
  }),
  actions: {
    async login(email: string, password: string) {
      const response = await authService.login(email, password);
      this.user = response.user;
      this.userData = response.user;
    },
    async register(email: string, password: string, displayName: string) {
      const response = await authService.register(email, password, displayName);
      this.user = response.user;
      this.userData = response.user;
    },
    async loadUserData() {
      try {
        const user = await authService.getCurrentUser();
        this.user = user;
        this.userData = user;
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
        // Si le token est invalide, déconnecter l'utilisateur
        await this.logout();
      }
    },
    async logout() {
      await authService.logout();
      this.user = null;
      this.userData = null;
    },
    initialize() {
      // Vérifier si l'utilisateur est déjà connecté (token dans localStorage)
      if (authService.isAuthenticated()) {
        const savedUser = authService.getUser();
        if (savedUser) {
          this.user = savedUser;
          this.userData = savedUser;
          // Recharger les données depuis le serveur pour s'assurer qu'elles sont à jour
          this.loadUserData();
        }
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.userData?.role === "admin",
  },
});
