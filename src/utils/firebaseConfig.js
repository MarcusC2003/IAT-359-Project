import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔑 REQUIRED IMPORTS FOR PERSISTENCE 🔑
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import {
  EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID,
  EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
} from "@env";

console.log("API KEY:", EXPO_PUBLIC_FIREBASE_API_KEY); 
const firebaseConfig = {
  apiKey: EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebase_app = initializeApp(firebaseConfig);
export const db = getFirestore(firebase_app);

// Initialize Auth using getAuth (instead of initializeAuth) 
// and pass the persistence configuration to ensure the user stays logged in.
export const firebase_auth = getAuth(firebase_app, 
    {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    }
);