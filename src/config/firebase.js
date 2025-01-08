import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase.config";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const Firebase = initializeApp(firebaseConfig);
export const database = getDatabase(Firebase);
export const auth = getAuth(Firebase);
export const Providers = { google: new GoogleAuthProvider() };
