// Service API de base pour communiquer avec le backend Express
const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Obtenir l'URL avec la langue pour les routes de produits
const getApiBaseUrl = (useLanguage: boolean = true): string => {
  if (!useLanguage) {
    return BASE_API_URL;
  }
  
  // Récupérer la langue depuis localStorage ou utiliser 'fr' par défaut
  const locale = localStorage.getItem("locale") || "fr";
  // Enlever /api de la fin si présent, puis ajouter /api/{lang}
  const baseWithoutApi = BASE_API_URL.replace(/\/api$/, "");
  return `${baseWithoutApi}/api/${locale}`;
};

export interface ApiError {
  error: string;
  message?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useLanguage: boolean = true
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const apiBaseUrl = getApiBaseUrl(useLanguage);
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: "Erreur de communication avec le serveur",
      }));
      throw new Error(error.message || error.error || "Une erreur est survenue");
    }

    // Si la réponse est vide (204 No Content), retourner null
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, useLanguage: boolean = true): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, useLanguage);
  }

  async post<T>(endpoint: string, data?: any, useLanguage: boolean = true): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      useLanguage
    );
  }

  async put<T>(endpoint: string, data?: any, useLanguage: boolean = true): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      useLanguage
    );
  }

  async delete<T>(endpoint: string, useLanguage: boolean = true): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" }, useLanguage);
  }

  // Pour l'upload de fichiers
  async uploadFile<T>(endpoint: string, file: File): Promise<T> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append("image", file);

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Pour l'upload, on utilise l'URL de base sans langue (route commune)
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: "Erreur lors de l'upload",
      }));
      throw new Error(error.message || error.error || "Erreur lors de l'upload");
    }

    return response.json();
  }
}

export const apiService = new ApiService();

