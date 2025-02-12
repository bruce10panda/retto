// Import Firebase modules
import { db } from "../../../firebaseconfig.js";
import { doc, setDoc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

// Redirect if no user is logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log("No user is logged in. Redirecting...");
    window.location.href = "../../../../login"; // Redirect if not logged in
  } else {
    console.log("User logged in:", user.email);
  }
});

function checkTextColor() {
  const colorDivs = document.querySelectorAll('.container .color'); // Only select colors inside .container

  colorDivs.forEach(div => {
    const bgColor = window.getComputedStyle(div).backgroundColor;
    if (!bgColor.startsWith("rgb")) return; // Skip invalid values

    const rgbValues = bgColor.match(/\d+/g).map(Number);
    const [r, g, b] = rgbValues;

    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Remove previous classes before adding new ones
    div.querySelectorAll('p, span').forEach(element => {
      element.classList.remove('light', 'dark');
      if (luminance < 0.5) {
        element.classList.add('dark'); // Light background -> Dark text
      } else {
        element.classList.add('light'); // Dark background -> Light text
      }
    });
  });
}

// Object to track locked colors
const lockedColors = {
  primary: false,
  secondary: false,
  tertiary: false,
  white: false,
  black: false
};

// Function to toggle lock state
function toggleLock(event) {
  const lockIcon = event.target;
  const colorDiv = lockIcon.parentElement;
  const colorId = colorDiv.id;

  // Toggle locked state
  lockedColors[colorId] = !lockedColors[colorId];

  // Change icon based on lock state
  if (lockedColors[colorId]) {
    lockIcon.textContent = "lock"; // Locked icon
  } else {
    lockIcon.textContent = "lock_open"; // Unlocked icon
  }
}

// Attach click event listeners to lock icons
document.addEventListener("DOMContentLoaded", () => {
  const lockIcons = document.querySelectorAll(".color .material-symbols-outlined");
  lockIcons.forEach(icon => {
    icon.addEventListener("click", toggleLock);
  });
});

// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r, g, b;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`;
}

// Function to generate new colors
function generateColors() {
  const baseHue = Math.floor(Math.random() * 360);

  // Check if each color is locked, if not, generate new
  const primary = lockedColors.primary ? getComputedStyle(document.documentElement).getPropertyValue('--palette-primary') : hslToRgb(baseHue, 0.7, 0.5);
  const secondary = lockedColors.secondary ? getComputedStyle(document.documentElement).getPropertyValue('--palette-secondary') : hslToRgb((baseHue + 120) % 360, 0.6 + Math.random() * 0.3, 0.4 + Math.random() * 0.3);
  const tertiary = lockedColors.tertiary ? getComputedStyle(document.documentElement).getPropertyValue('--palette-tertiary') : hslToRgb((baseHue + (Math.random() * 60 - 30)) % 360, 0.4 + Math.random() * 0.2, 0.5 + Math.random() * 0.1);
  const white = lockedColors.white ? getComputedStyle(document.documentElement).getPropertyValue('--palette-white') : hslToRgb(baseHue, 0.05, 0.95);
  const black = lockedColors.black ? getComputedStyle(document.documentElement).getPropertyValue('--palette-black') : hslToRgb(baseHue, 0.1, 0.1);

// Apply colors to elements with the class `.palettecolorp`
document.querySelectorAll('.palettecolorp').forEach(element => {
  element.style.color = primary;
});

document.querySelectorAll('.palettecolorpb').forEach(element => {
  element.style.setProperty("background-color", primary, "important");
});

document.documentElement.style.backgroundColor = black;
document.body.style.backgroundColor = black;

    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--palette-primary', primary);
    document.documentElement.style.setProperty('--palette-secondary', secondary);
    document.documentElement.style.setProperty('--palette-tertiary', tertiary);
    document.documentElement.style.setProperty('--palette-white', white);
    document.documentElement.style.setProperty('--palette-black', black);

  // Update background colors of elements
  document.getElementById('primary').style.backgroundColor = primary;
  document.getElementById('secondary').style.backgroundColor = secondary;
  document.getElementById('tertiary').style.backgroundColor = tertiary;
  document.getElementById('white').style.backgroundColor = white;
  document.getElementById('black').style.backgroundColor = black;

  checkTextColor();
}

// Function to save colors to Firestore
async function savePalette() {
  const primary = getComputedStyle(document.documentElement).getPropertyValue('--palette-primary');
  const secondary = getComputedStyle(document.documentElement).getPropertyValue('--palette-secondary');
  const tertiary = getComputedStyle(document.documentElement).getPropertyValue('--palette-tertiary');
  const white = getComputedStyle(document.documentElement).getPropertyValue('--palette-white');
  const black = getComputedStyle(document.documentElement).getPropertyValue('--palette-black');

  // Get the current user's UID (assuming the user is logged in)
  const user = getAuth().currentUser;
  if (!user) {
    console.log("No user is logged in.");
    return;
  }

  // Prepare the palette data
  const paletteData = {
    primary,
    secondary,
    tertiary,
    white,
    black,
    timestamp: new Date(), // Add timestamp for when the palette was saved
  };

  try {
    // Reference to the user's 'toolkitmode' document
    const toolkitModeRef = doc(db, "users", user.uid, "toolkitmode", "initialize"); // This is a document under the user

    // Check if the 'toolkitmode' document exists; if not, create it
    const docSnap = await getDoc(toolkitModeRef);
    if (!docSnap.exists()) {
      await setDoc(toolkitModeRef, {}); // Create 'toolkitmode' document if it doesn't exist
      console.log("Created toolkitmode document for the user.");
    }

    // Now, get reference to the 'palettes' collection inside the 'toolkitmode' document
    const palettesRef = collection(toolkitModeRef, "palettes");

    // Add a new palette document with auto-generated ID
    await addDoc(palettesRef, paletteData);

    console.log("Palette saved successfully!");
  } catch (error) {
    console.error("Error saving palette: ", error);
  }
}

// Make function globally accessible
window.generateColors = generateColors;
window.savePalette = savePalette;
document.addEventListener('DOMContentLoaded', checkTextColor);
document.addEventListener('DOMContentLoaded', generateColors);