

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxkabccm8TDL6ku0nrrUQHtbv5w2upm3s",
  authDomain: "beststore-b8257.firebaseapp.com",
  projectId: "beststore-b8257",
  storageBucket: "beststore-b8257.appspot.com",
  messagingSenderId: "175988176537",
  appId: "1:175988176537:web:1840fd9820391d59bbaa08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore() //.setting({ "timestampsInSnapshots": true });
const database = getDatabase();





export default app;
export {
    database,
    firestore
};
