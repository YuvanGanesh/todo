// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4AhTA8YoQZ47bCd_0WDDfybXT-21Jb-4",
  authDomain: "personal-task-manager-9ded9.firebaseapp.com",
  databaseURL: "https://personal-task-manager-9ded9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "personal-task-manager-9ded9",
  storageBucket: "personal-task-manager-9ded9.firebasestorage.app",
  messagingSenderId: "1087987287802",
  appId: "1:1087987287802:web:1345dc79ca5fe44c1eab43"
};

// Initialize Firebase
const App = initializeApp(firebaseConfig);

export const auth = getAuth(App);
export const db = getFirestore(App);
export const realtimeDb = getDatabase(App);