// For your Web App (TypeScript/JavaScript Frontend)

import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyDyCk6zn1OEGNt4_8OTu99vDQKX2hl6bqg",
    authDomain: "trello-dashboard-visualizer.firebaseapp.com",
    projectId: "trello-dashboard-visualizer",
    storageBucket: "trello-dashboard-visualizer.firebasestorage.app",
    messagingSenderId: "352103218030",
    appId: "1:352103218030:web:552840592ee2921297df7f"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

if (process.env.NODE_ENV !== 'production' && window.location.hostname === "localhost") {
    connectFunctionsEmulator(functions, "localhost", 5001);
}
