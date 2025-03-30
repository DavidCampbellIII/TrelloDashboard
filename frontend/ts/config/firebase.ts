// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Initialize Firebase
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// For local development, you can use the .env values directly here
// For production, these will be replaced during the build process through esbuild
const firebaseConfig: FirebaseConfig = {
  apiKey: __FIREBASE_API_KEY__,
  authDomain: __FIREBASE_AUTH_DOMAIN__,
  projectId: __FIREBASE_PROJECT_ID__,
  storageBucket: __FIREBASE_STORAGE_BUCKET__,
  messagingSenderId: __FIREBASE_MESSAGING_SENDER_ID__,
  appId: __FIREBASE_APP_ID__
};
const app = initializeApp(firebaseConfig);

// Get Functions instance
const functions = getFunctions(app);

// If we're in development mode, connect to the Functions emulator
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export { app, functions };
