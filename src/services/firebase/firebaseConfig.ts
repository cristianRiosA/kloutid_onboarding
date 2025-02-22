import { firebase } from "@/environment";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: firebase.key,
  authDomain: firebase.domain,
  projectId: firebase.projectId,
  storageBucket: firebase.storageBucket,
  messagingSenderId: firebase.senderId,
  appId: firebase.appId,
  measurementId: firebase.measurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export const getFirebaseAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  return await user.getIdToken();
};

if (typeof window !== "undefined") {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken();
      localStorage.setItem("firebaseToken", token);
    } else {
      localStorage.removeItem("firebaseToken");
    }
  });
}

export { auth, googleProvider, db };
