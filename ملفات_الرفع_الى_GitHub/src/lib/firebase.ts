import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDg3aTx4HQg60XPB6nDScBi1BMaeUdYoVA",
  authDomain: "store-f80b9.firebaseapp.com",
  databaseURL: "https://store-f80b9-default-rtdb.firebaseio.com",
  projectId: "store-f80b9",
  storageBucket: "store-f80b9.firebasestorage.app",
  messagingSenderId: "876654114470",
  appId: "1:876654114470:web:e01e65c16ea4aa902f6667",
  measurementId: "G-XRV11SQZ20"
};

// Initialize Firebase safely
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const rtdb = typeof window !== 'undefined' ? getDatabase(firebaseApp) : null;
export const firestore = typeof window !== 'undefined' ? getFirestore(firebaseApp) : null;
