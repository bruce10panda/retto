// Import Firebase SDK modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCO82uG0A2ndt8J-9Enrj4lUxHlvkmiX64",
    authDomain: "retto-bcb89.firebaseapp.com",
    projectId: "retto-bcb89",
    storageBucket: "retto-bcb89.firebasestorage.app",
    messagingSenderId: "1059937497199",
    appId: "1:1059937497199:web:e84ac704bb181f98f85d9a",
    measurementId: "G-BW9PHLZBFG"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase instances
export { db, auth };
