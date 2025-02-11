// Import Firebase services from firebaseConfig.js
import { db, auth } from "../firebaseconfig.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Toggle between login and signup forms
window.toggleForms = function (formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (formType === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
};

// Login Function
window.login = function () {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Logged in:", user);
            alert("Login successful!");
            window.location.href = "../app"; // Redirect after login
        })
        .catch((error) => {
            console.error("Login Error:", error.code, error.message);
            alert("Login failed: " + error.message);
        });
};

// Signup Function
window.signup = function () {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const username = document.getElementById('signupUsername').value; // Get the username value

  if (!username) {
    alert("Please enter a username!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          const user = userCredential.user;
          console.log("Signed up:", user);

          // Create a document in the 'users' collection with the user's email and username
          const userRef = doc(db, "users", user.uid);  // Use the user's UID as the document ID
          setDoc(userRef, {
              email: user.email,  // Write user's email to their own collection document
              username: username,  // Write username to their own collection document
              createdAt: new Date(),  // Optionally, track when the user signed up
          })
          .then(() => {
              console.log("User data written to Firestore successfully!");
              alert("Signup successful!");
              window.location.href = "../app"; // Redirect after signup
          })
          .catch((error) => {
              console.error("Error writing user data to Firestore: ", error);
              alert("Signup failed: " + error.message);
          });
      })
      .catch((error) => {
          console.error("Signup Error:", error.code, error.message);
          alert("Signup failed: " + error.message);
      });
};
