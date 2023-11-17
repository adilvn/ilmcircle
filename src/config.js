import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
const firebaseConfig = {
    apiKey: "AIzaSyB1JrSJaUMP5VtLfZJFy9qBSiZUA7v08Kg",
    authDomain: "ilm-circle-2ab93.firebaseapp.com",
    projectId: "ilm-circle-2ab93",
    storageBucket: "ilm-circle-2ab93.appspot.com",
    messagingSenderId: "50137630524",
    appId: "1:50137630524:web:4c0f46b29bc0e1dd2ec039",
    measurementId: "G-JDBH9BSJXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export { auth, provider };