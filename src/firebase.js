// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDxYkFXAXHmcWkIf_hzezL3ZaaOoVT5Z8Y",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "traderkev-client-login.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "traderkev-client-login",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "traderkev-client-login.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "9165459487",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:9165459487:web:f88af06e32a71dbbc0852a",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-0TGRJ02V2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export { analytics };
export default app;
