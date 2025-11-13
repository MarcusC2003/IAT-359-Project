import { initializeApp } from "firebase/app";

import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence
} from "firebase/auth"; 

import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6KZ_yZGrJRfiY4qpaQqqYFW4x6915De4",
  authDomain: "palanner-c8edc.firebaseapp.com",
  projectId: "palanner-c8edc",
  storageBucket: "palanner-c8edc.firebasestorage.app",
  messagingSenderId: "375339816481",
  appId: "1:375339816481:web:f5f9f63c38ea603e563560",
  measurementId: "G-WPM56YT3W9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);