import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
const firebaseConfig = {
  apiKey: "AIzaSyA5dgphkznom5xpTLAPOiJAUclUim4ozd0",
  authDomain: "pontinhosc-39cf0.firebaseapp.com",
  projectId: "pontinhosc-39cf0",
  storageBucket: "pontinhosc-39cf0.appspot.com",
  messagingSenderId: "960544111866",
  appId: "1:960544111866:web:8597018369d4ec200e1d43"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export const FieldValue = firebase.firestore.FieldValue; 