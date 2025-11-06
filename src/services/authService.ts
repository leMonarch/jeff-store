import { apiService } from "./apiService";

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

class AuthService {
  private readonly TOKEN_KEY = "auth_token";
  private readonly USER_KEY = "auth_user";

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // Route auth n'utilise pas la langue
    const response = await apiService.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      },
      false // Pas de langue pour les routes auth
    );
    this.setToken(response.token);
    this.setUser(response.user);
    return response;
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<RegisterResponse> {
    // Route auth n'utilise pas la langue
    const response = await apiService.post<RegisterResponse>(
      "/auth/register",
      {
        email,
        password,
        name,
      },
      false // Pas de langue pour les routes auth
    );
    this.setToken(response.token);
    this.setUser(response.user);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    // Route auth n'utilise pas la langue
    return apiService.get<User>("/auth/me", false);
  }

  async logout(): Promise<void> {
    this.clearAuth();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

