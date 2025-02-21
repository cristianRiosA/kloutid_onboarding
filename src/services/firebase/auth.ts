import { auth, googleProvider } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";

let currentUser: User | null = null;

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (user && typeof window !== "undefined") {
    const token = await user.getIdToken();
    localStorage.setItem("firebaseToken", token);
  } else if (typeof window !== "undefined") {
    localStorage.removeItem("firebaseToken");
  }
});

export const getAuthToken = async (): Promise<string | null> => {
  if (!currentUser) {
    console.error("🔴 No hay usuario autenticado");
    return null;
  }
  return await currentUser.getIdToken();
};

export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential;
};

export const registerWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential;
};

export const loginWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential;
};

export const logout = async () => {
  await signOut(auth);
  currentUser = null;

  if (typeof window !== "undefined") {
    localStorage.removeItem("firebaseToken");
  }
};
