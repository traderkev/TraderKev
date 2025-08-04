// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxYkFXAXHmcWkIf_hzezL3ZaaOoVT5Z8Y",
  authDomain: "traderkev-client-login.firebaseapp.com",
  projectId: "traderkev-client-login",
  storageBucket: "traderkev-client-login.firebasestorage.app",
  messagingSenderId: "9165459487",
  appId: "1:9165459487:web:f88af06e32a71dbbc0852a",
  measurementId: "G-0TGRJ02V2P"
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
