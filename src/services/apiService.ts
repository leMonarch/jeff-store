// Service API de base pour communiquer avec le backend Express
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

