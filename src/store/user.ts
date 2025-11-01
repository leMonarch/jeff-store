import { defineStore } from "pinia";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as any,
    userData: null as any,
  }),
  actions: {
    async login(email: string, password: string) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      this.user = result.user;
      await this.loadUserData(result.user.uid);
    },
    async register(email: string, password: string, displayName: string) {
      // Create user account
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        email: email,
        displayName: displayName,
        photoURL: null,
        role: "client",
        createdAt: new Date(),
      });

      this.user = result.user;
      this.userData = { displayName, email, role: "client" };
    },
    async loadUserData(uid: string) {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        this.userData = userDoc.data();
      }
    },
    async logout() {
      await signOut(auth);
      this.user = null;
      this.userData = null;
    },
    initialize() {
      onAuthStateChanged(auth, async (user) => {
        this.user = user;
        if (user) {
          await this.loadUserData(user.uid);
        }
      });
    },
  },
});
