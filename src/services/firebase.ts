import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("Firebase Config:", firebaseConfig); // ← utile pour déboguer

// Vérifie que toutes les clés existent avant d'initialiser
for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    console.error(`⚠️ Missing Firebase config value: ${key}`);
  }
}

console.log("VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log(
  "VITE_FIREBASE_AUTH_DOMAIN:",
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
);
console.log(
  "VITE_FIREBASE_PROJECT_ID:",
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);
console.log(
  "VITE_FIREBASE_STORAGE_BUCKET:",
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
);
console.log(
  "VITE_FIREBASE_MESSAGING_SENDER_ID:",
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
);
console.log("VITE_FIREBASE_APP_ID:", import.meta.env.VITE_FIREBASE_APP_ID);

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
