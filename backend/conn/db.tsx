// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPIsw-uWmKo5K8Rf3nEla_yp8iiA2jj4I",
  authDomain: "inventory-qr-a8a73.firebaseapp.com",
  databaseURL: "https://inventory-qr-a8a73-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "inventory-qr-a8a73",
  storageBucket: "inventory-qr-a8a73.firebasestorage.app",
  messagingSenderId: "542265128527",
  appId: "1:542265128527:web:7a10d9547fa388ac019c3a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);