import { apiService } from "./apiService";

export interface NewsletterSubscriber {
  id: number;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterResponse {
  message: string;
  subscriber?: NewsletterSubscriber;
}

export interface SubscribersResponse {
  count: number;
  subscribers: NewsletterSubscriber[];
}

/**
 * S'abonner à la newsletter
 */
export async function subscribeToNewsletter(email: string): Promise<NewsletterResponse> {
  // Route newsletter n'utilise pas la langue
  return apiService.post<NewsletterResponse>("/newsletter/subscribe", { email }, false);
}

/**
 * Se désabonner de la newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<void> {
  const encodedEmail = encodeURIComponent(email);
  // Route newsletter n'utilise pas la langue
  return apiService.delete<void>(`/newsletter/unsubscribe/${encodedEmail}`, false);
}

/**
 * Récupérer tous les abonnés actifs (Admin uniquement)
 */
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  // Route newsletter n'utilise pas la langue
  const response = await apiService.get<SubscribersResponse>("/newsletter/subscribers?active=true", false);
  return response.subscribers;
}

/**
 * Obtenir le nombre d'abonnés actifs
 */
export async function getSubscriberCount(): Promise<number> {
  // Route newsletter n'utilise pas la langue
  const response = await apiService.get<{ count: number }>("/newsletter/count", false);
  return response.count;
}

/**
 * Envoyer une newsletter manuelle (Admin uniquement)
 */
export async function sendManualNewsletter(data: {
  subject: string;
  content: string;
}): Promise<{ message: string; total: number; success: number; failed: number }> {
  // Route newsletter n'utilise pas la langue
  return apiService.post("/newsletter/send", data, false);
}

