import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5SxwyMjGDY7maDFCwuIWsRM9KZXA5bM4",
  authDomain: "kloutid-dev.firebaseapp.com",
  projectId: "kloutid-dev",
  storageBucket: "kloutid-dev.firebasestorage.app",
  messagingSenderId: "41408158804",
  appId: "1:41408158804:web:9f8678d736ece7b441e1c1",
  measurementId: "G-P0M49FRQHX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
