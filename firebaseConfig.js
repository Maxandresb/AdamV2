import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const apiKey_Firebase= process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const authDomain_Firebase= process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId_Firebase= process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket_Firebase= process.env.EXPO_PUBLIC_FIREBASE_STORAGE;
const messagingSenderId_Firebase= process.env.EXPO_PUBLIC_FIREBASE_MESSAGING;
const appId_Firebase= process.env.EXPO_PUBLIC_FIREBASE_APP_ID;
const measurementId_Firebase= process.env.EXPO_PUBLIC_FIREBASE_MESUREMENT;

// Initialize Firebase
const firebaseConfig = {
    apiKey: apiKey_Firebase,
    authDomain: authDomain_Firebase,
    projectId: projectId_Firebase,
    storageBucket: storageBucket_Firebase,
    messagingSenderId: messagingSenderId_Firebase,
    appId: appId_Firebase,
    measurementId: measurementId_Firebase
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);