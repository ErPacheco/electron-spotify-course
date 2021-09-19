// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCYbVnUdyS5VOmXSzuPgemhg6CD0xFTfdE",

  authDomain: "electron-js-course.firebaseapp.com",

  projectId: "electron-js-course",

  storageBucket: "electron-js-course.appspot.com",

  messagingSenderId: "470752912313",

  appId: "1:470752912313:web:7110d0cc03a3a47bcc8c68",
};

// Initialize Firebase
export default initializeApp(firebaseConfig);
