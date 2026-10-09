/**
 * IIT (ISM) DHANBAD — FIREBASE CONFIGURATION & INITIALIZATION
 * Straw Hat Fleet Cloud Authentication & Firestore Sync
 */

// 1. Firebase Project Credentials
// Replace the placeholder values below with your Firebase Project Web App credentials,
// or provide them in chat and they will be placed here automatically.
const defaultFirebaseConfig = {
  apiKey: "AIzaSyDf-n0HsAnWkMUBo4h9Bq1ZGxLX5dItUbQ",
  authDomain: "wive-hackathon-ae8e8.firebaseapp.com",
  projectId: "wive-hackathon-ae8e8",
  storageBucket: "wive-hackathon-ae8e8.firebasestorage.app",
  messagingSenderId: "248048257734",
  appId: "1:248048257734:web:7b698af21db908d9afa5c7",
  measurementId: "G-SD0T6D8F5L"
};

// Check if credentials exist in localStorage (allows quick setup from browser UI)
function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem('iitism_custom_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && !parsed.apiKey.includes('YOUR_API_KEY')) {
        return parsed;
      }
    }
  } catch (e) {}
  return defaultFirebaseConfig;
}

const firebaseConfig = getActiveFirebaseConfig();

// 2. Initialize Firebase SDK if available
window.isFirebaseConfigured = false;
window.fbAuth = null;
window.fbDb = null;

(function initFirebase() {
  const isPlaceholder = !firebaseConfig.apiKey || 
    firebaseConfig.apiKey.includes("YOUR_API_KEY") || 
    firebaseConfig.projectId.includes("your-project-id");

  if (typeof firebase !== 'undefined' && !isPlaceholder) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      window.fbAuth = firebase.auth();
      if (firebase.firestore) {
        window.fbDb = firebase.firestore();
      }
      if (firebase.analytics) {
        try { firebase.analytics(); } catch (e) {}
      }
      window.isFirebaseConfigured = true;
      console.log('🔥 [Firebase Connected] Successfully connected to project:', firebaseConfig.projectId);
    } catch (err) {
      console.warn('⚠️ [Firebase Init Warning]', err.message);
    }
  } else {
    console.info('ℹ️ [Firebase Notice] Running with Local/Demo Auth. Update js/firebase-config.js with your Firebase Project credentials to activate live cloud auth.');
  }
})();
