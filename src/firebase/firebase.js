// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANZOCr_ZOpqDAtgwG_T2ZWZHliHQohoO0",
  authDomain: "seng513-project-group26.firebaseapp.com",
  projectId: "seng513-project-group26",
  storageBucket: "seng513-project-group26.firebasestorage.app",
  messagingSenderId: "291112557900",
  appId: "1:291112557900:web:421c37677c3408396603e9",
  measurementId: "G-ZTH3XZXHVS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
