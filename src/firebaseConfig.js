import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOsuKhmveT9UW89D2ArpIZ_WlSx9p3yyM",
  authDomain: "personal-file-manager-5dfdb.firebaseapp.com",
  projectId: "personal-file-manager-5dfdb",
  storageBucket: "personal-file-manager-5dfdb.appspot.com",
  messagingSenderId: "283107793555",
  appId: "1:283107793555:web:c361e1b128c63f39de0b66",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
