import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { storage, db, auth } from "./firebase";
import type { Product } from "../types";

export async function uploadImage(file: File): Promise<string> {
  console.log("[AdminService] Début de l'upload d'image");

  // Vérifier que l'utilisateur est authentifié
  if (!auth.currentUser) {
    console.error("[AdminService] Utilisateur non authentifié");
    throw new Error("Vous devez être connecté pour uploader une image");
  }

  console.log(
    "[AdminService] Utilisateur authentifié, UID:",
    auth.currentUser.uid
  );
  console.log("[AdminService] Email:", auth.currentUser.email);

  // Note: On ne peut pas accéder directement au store ici, mais on peut vérifier dans Firestore
  // L'utilisateur doit charger ses données via le store avant d'uploader

  // Vérifier la taille du fichier (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("L'image est trop grande. Taille maximale : 10MB");
  }

  // Créer un nom de fichier unique
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name.replace(/\s+/g, "_")}`;
  const storageRef = ref(storage, `impressions/${fileName}`);

  try {
    // Uploader le fichier vers Firebase Storage
    await uploadBytes(storageRef, file);

    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    console.error("Erreur lors de l'upload vers Firebase Storage:", error);

    // Gestion des erreurs spécifiques
    if (error.code === "storage/unauthorized") {
      throw new Error(
        "Vous n'avez pas les permissions pour uploader des images. " +
          "Vérifiez que vous êtes connecté en tant qu'administrateur et que les règles de sécurité Storage sont correctement configurées."
      );
    }

    // Erreur CORS ou Storage non activé
    if (
      error.message?.includes("CORS") ||
      error.message?.includes("network") ||
      error.code === "storage/unknown" ||
      error.code === "storage/object-not-found"
    ) {
      throw new Error(
        "Firebase Storage n'est pas activé ou mal configuré. " +
          "Allez sur https://console.firebase.google.com/project/jeff-app-1ed7a/storage " +
          "pour activer Firebase Storage, puis déployez les règles avec : firebase deploy --only storage"
      );
    }

    throw new Error(`Erreur lors de l'upload: ${error.message || error}`);
  }
}

export async function addProduct(
  productData: Omit<Product, "id">
): Promise<string> {
  // Ajouter le produit dans Firestore avec le champ sendNewsletter
  // La Cloud Function se déclenchera automatiquement et vérifiera ce champ
  const docRef = await addDoc(collection(db, "products"), {
    ...productData,
    createdAt: new Date(),
    active: productData.active !== undefined ? productData.active : true,
    sendNewsletter:
      productData.sendNewsletter !== undefined
        ? productData.sendNewsletter
        : false,
  });

  console.log(
    `[AdminService] Impression "${productData.name}" ajoutée. ` +
      `Newsletter: ${productData.sendNewsletter ? "Oui" : "Non"}`
  );

  return docRef.id;
}

/**
 * Envoyer une newsletter manuelle à tous les abonnés
 * Cette fonction crée un document dans Firestore qui déclenche la Cloud Function
 */
export async function sendManualNewsletter(data: {
  subject: string;
  content: string;
}): Promise<void> {
  // Créer un document dans la collection newsletter_campaigns
  // La Cloud Function écoute cette collection et envoie les emails
  await addDoc(collection(db, "newsletter_campaigns"), {
    subject: data.subject,
    content: data.content,
    createdAt: new Date(),
    sent: false, // Sera mis à true par la Cloud Function après l'envoi
    type: "manual", // Pour distinguer des newsletters automatiques liées aux produits
  });

  console.log(
    `[AdminService] Campagne newsletter créée. Sujet: "${data.subject}"`
  );
}

/**
 * Récupérer le nombre d'abonnés actifs
 */
export async function getSubscriberCount(): Promise<number> {
  const subscribersQuery = query(
    collection(db, "newsletter"),
    where("active", "==", true)
  );
  const snapshot = await getDocs(subscribersQuery);
  return snapshot.size;
}
