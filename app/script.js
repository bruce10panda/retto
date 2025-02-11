// Import Firebase modules
import { db } from "../firebaseconfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

// Redirect if no user is logged in and change username
onAuthStateChanged(auth, async (user) => {
  if (!user) {
      console.log("No user is logged in. Redirecting...");
      window.location.href = "../login"; // Redirect if not logged in
  } else {
      console.log("User logged in:", user.email);

      // Fetch the user's username from Firestore
      const userRef = doc(db, "users", user.uid); // Use the UID to get the user document
      try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
              const username = userDoc.data().username; // Assuming 'username' is stored in Firestore
              document.getElementById('username-placeholder').textContent = username; // Update the span with the username
          } else {
              console.log("No such document for the user!");
          }
      } catch (error) {
          console.error("Error getting user data:", error);
      }
  }
});