// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0omcezZ7-ihyy0qzhXBpBURW1kbDDzvw",
  authDomain: "metodohill-d4bb2.firebaseapp.com",
  projectId: "metodohill-d4bb2",
  storageBucket: "metodohill-d4bb2.firebasestorage.app",
  messagingSenderId: "379655046446",
  appId: "1:379655046446:web:165ccd6798aee430cfa6bf",
  measurementId: "G-1C4HJ0WFDD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };