import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Load environment variables
// import {
//   FIREBASE_API_KEY,
//   FIREBASE_AUTH_DOMAIN,
//   FIREBASE_PROJECT_ID,
//   FIREBASE_STORAGE_BUCKET,
//   FIREBASE_MESSAGING_SENDER_ID,
//   FIREBASE_APP_ID,
//   FIREBASE_MEASUREMENT_ID
// } from "@env";

// console.log("Loaded API KEY:", FIREBASE_API_KEY);

// const firebaseConfig = {
//   apiKey: FIREBASE_API_KEY,
//   authDomain: FIREBASE_AUTH_DOMAIN,
//   projectId: FIREBASE_PROJECT_ID,
//   storageBucket: FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
//   appId: FIREBASE_APP_ID,
//   measurementId: FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyC6KZ_yZGrJRfiY4qpaQqqYFW4x6915De4",
  authDomain: "palanner-c8edc.firebaseapp.com",
  projectId: "palanner-c8edc",
  storageBucket: "palanner-c8edc.firebasestorage.app",
  messagingSenderId: "375339816481",
  appId: "1:375339816481:web:f5f9f63c38ea603e563560",
  measurementId: "G-WPM56YT3W9"
};

export const firebase_app = initializeApp(firebaseConfig);
export const firebase_auth = getAuth(firebase_app);
export const db = getFirestore(firebase_app);


