import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:"AIzaSyCywA-FXcqXpe45UiTNBxHRwS5TDEJrAD8" ,
  authDomain: "chatapp-3815a.firebaseapp.com",
  projectId: "chatapp-3815a",
  storageBucket: "chatapp-3815a.appspot.com",
  messagingSenderId: "829542260956",
  appId: "1:829542260956:web:2003db651a92bf67d31419"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()