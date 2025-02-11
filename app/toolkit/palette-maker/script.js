// Import Firebase modules
import { db } from "../../../firebaseconfig.js";
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

// script.js
document.addEventListener('DOMContentLoaded', () => {
  const colorDivs = document.querySelectorAll('.color');

  colorDivs.forEach(div => {
    const bgColor = window.getComputedStyle(div).backgroundColor;
    const rgbValues = bgColor.substring(4, bgColor.length - 1).split(',');
    const r = parseInt(rgbValues[0].trim());
    const g = parseInt(rgbValues[1].trim());
    const b = parseInt(rgbValues[2].trim());

    // Calculate luminance (a common way to determine lightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    if (luminance > 0.5) { // Adjust 0.5 threshold as needed
      div.querySelectorAll('p, span').forEach(element => {
        element.classList.add('light');
      });
    }
  });
});
