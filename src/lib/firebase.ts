import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA591swrkLM_0I-lqpZkMIENp75ZLI8hpM",
  authDomain: "darkscore-703a5.firebaseapp.com",
  projectId: "darkscore-703a5",
  storageBucket: "darkscore-703a5.firebasestorage.app",
  messagingSenderId: "1045741537291",
  appId: "1:1045741537291:web:a3a869e9c88a1cc0c3df0e",
  measurementId: "G-J3803RFG6V",
  databaseURL: "https://darkscore-703a5-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { database, auth };
