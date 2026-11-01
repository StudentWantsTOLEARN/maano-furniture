import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4nWHGAMAgcbmbKTFNf-n3JWSwkYqGzUM",
  authDomain: "furniture-shop-b2138.firebaseapp.com",
  projectId: "furniture-shop-b2138",
  storageBucket: "furniture-shop-b2138.firebasestorage.app",
  messagingSenderId: "312378068214",
  appId: "1:312378068214:web:23a9bb67b8c84e6b7630d7",
  measurementId: "G-5BBRNC0NGM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithFacebook = () => signInWithPopup(auth, facebookProvider);

export const registerWithEmail = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (name && userCredential.user) {
    await updateProfile(userCredential.user, { displayName: name });
  }
  return userCredential;
};

export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

// Helper to save uploaded avatar to Firebase Auth User Profile
export const updateUserProfilePhoto = async (photoURL) => {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { photoURL });
  }
};

export const logoutUser = () => signOut(auth);