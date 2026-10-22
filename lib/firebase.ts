import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

export const REQUIRED_FIREBASE_ENV_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const getMissingFirebaseEnvVars = (): string[] => {
  const missing: string[] = [];
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("your_")) {
    missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  }
  if (!firebaseConfig.authDomain || firebaseConfig.authDomain.includes("your_")) {
    missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  }
  if (!firebaseConfig.projectId || firebaseConfig.projectId.includes("your_")) {
    missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  }
  if (!firebaseConfig.appId || firebaseConfig.appId.includes("your_")) {
    missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");
  }
  return missing;
};

const missingVars = getMissingFirebaseEnvVars();
export const isFirebaseConfigured = missingVars.length === 0;

export function assertFirebaseConfigured(): void {
  const missing = getMissingFirebaseEnvVars();
  if (missing.length > 0) {
    throw new Error(
      `Firebase configuration is missing in .env.local. Please configure: ${missing.join(", ")}`
    );
  }
}

// Initialize Firebase safely when configured
let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  authInstance = getAuth(appInstance);
  googleProviderInstance = new GoogleAuthProvider();
  googleProviderInstance.setCustomParameters({ prompt: "select_account" });
}

export const app = appInstance;
export const auth = authInstance;
export const googleProvider = googleProviderInstance;

export default appInstance;

