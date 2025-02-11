// Import Firebase modules
import { db } from "../firebaseconfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

// Redirect if no user is logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
      console.log("No user is logged in. Redirecting...");
      window.location.href = "../login"; // Redirect if not logged in
  } else {
      console.log("User logged in:", user.email);
  }
});