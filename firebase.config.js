// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqMxV7GfldGzEfd_igTWy-biWroyODFmo",
  authDomain: "pocucunisaludable.firebaseapp.com",
  projectId: "pocucunisaludable",
  storageBucket: "pocucunisaludable.firebasestorage.app",
  messagingSenderId: "1051466738850",
  appId: "1:1051466738850:web:61c4f41d0a871b031cbbfb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);