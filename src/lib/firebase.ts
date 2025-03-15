
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJDQACEXGIVGYELO4XN90UNaO6tYeN5GM", // This is a placeholder, replace with your actual API key
  authDomain: "darkscore-battlefield.firebaseapp.com",
  projectId: "darkscore-battlefield",
  storageBucket: "darkscore-battlefield.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456ghi789jkl",
  measurementId: "G-MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
