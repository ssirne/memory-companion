import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyDvndKtfIdLslCBnJP1apfnbkbc7fZVUgI",

  authDomain: "memory-companion-64d45.firebaseapp.com",

  projectId: "memory-companion-64d45",

  storageBucket: "memory-companion-64d45.firebasestorage.app",

  messagingSenderId: "369279112457",

  appId: "1:369279112457:web:bad8ded412d72f7f5a6fd8",

  measurementId: "G-L1W1P0YQY5"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);