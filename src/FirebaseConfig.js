import { initializeApp } from "firebase/app";

import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence // <-- Add it here
} from "firebase/auth"; 

import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyDPjRPsBp6_md3cJo6qx8pp8Btx7wEoEG0",
  authDomain: "plannertesting-df25a.firebaseapp.com",
  projectId: "plannertesting-df25a",
  storageBucket: "plannertesting-df25a.firebasestorage.app",
  messagingSenderId: "641196949913",
  appId: "1:641196949913:web:b39b4248eba9bc2f355308"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the services you'll use
// This new block replaces 'export const auth = getAuth(app);'
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);