// Import Firebase modules
import { db } from "../../firebaseconfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

// Redirect if no user is logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
      console.log("No user is logged in. Redirecting...");
      window.location.href = "../../../login"; // Redirect if not logged in
  } else {
      console.log("User logged in:", user.email);
  }
});

// Function to write data
window.writeData = async function () {
    const collectionName = document.getElementById("collectionName").value;
    const documentId = document.getElementById("documentId").value;
    const dataField = document.getElementById("dataField").value;
    const dataValue = document.getElementById("dataValue").value;

    if (!collectionName || !documentId || !dataField || !dataValue) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        await setDoc(doc(db, collectionName, documentId), { [dataField]: dataValue });
        console.log("Document successfully written!");
        document.getElementById("status").textContent = "Document written successfully!";
    } catch (error) {
        console.error("Error writing document: ", error);
        document.getElementById("status").textContent = "Error writing document: " + error;
    }
};

// Function to read data
window.readData = async function () {
    const collectionName = document.getElementById("readCollectionName").value;
    const documentId = document.getElementById("readDocumentId").value;

    if (!collectionName || !documentId) {
        alert("Please fill in collection and document ID to read.");
        return;
    }

    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            document.getElementById("readResult").textContent = JSON.stringify(docSnap.data(), null, 2);
        } else {
            console.log("No such document!");
            document.getElementById("readResult").textContent = "No such document!";
        }
    } catch (error) {
        console.error("Error getting document:", error);
        document.getElementById("readResult").textContent = "Error reading document: " + error;
    }
};
