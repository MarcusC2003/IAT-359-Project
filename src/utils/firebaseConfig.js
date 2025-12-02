import { initializeApp } from 'firebase/app'; 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// 1. CONFIG: Use your hardcoded config for now, but switch to environment variables!
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


export const firebase_auth = initializeAuth(firebase_app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export const db = getFirestore(firebase_app);
