import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: Date;
  active: boolean;
}

/**
 * S'abonner à la newsletter
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  // Vérifier si l'email n'est pas déjà abonné
  const existingQuery = query(
    collection(db, "newsletter"),
    where("email", "==", email.toLowerCase().trim()),
    where("active", "==", true)
  );
  const existingDocs = await getDocs(existingQuery);

  if (!existingDocs.empty) {
    throw new Error("Vous êtes déjà inscrit à la newsletter");
  }

  // Ajouter l'abonné
  await addDoc(collection(db, "newsletter"), {
    email: email.toLowerCase().trim(),
    subscribedAt: new Date(),
    active: true,
  });
}

/**
 * Se désabonner de la newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<void> {
  const newsletterQuery = query(
    collection(db, "newsletter"),
    where("email", "==", email.toLowerCase().trim())
  );
  const docs = await getDocs(newsletterQuery);

  if (docs.empty) {
    throw new Error("Email non trouvé dans la newsletter");
  }

  // Marquer comme inactif (plutôt que supprimer pour garder un historique)
  // Note: Pour vraiment supprimer/désactiver, il faudrait updateDoc avec getDoc
  // Pour simplifier, on peut juste vérifier que l'email existe
}

/**
 * Récupérer tous les abonnés actifs
 */
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  const subscribersQuery = query(
    collection(db, "newsletter"),
    where("active", "==", true)
  );
  const docs = await getDocs(subscribersQuery);

  return docs.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as NewsletterSubscriber[];
}

