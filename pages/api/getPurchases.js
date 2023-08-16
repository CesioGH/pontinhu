// pages/api/getPurchases.js

import { doc, getFirestore, getDoc ,addDoc, collection, getDocs, query, where, setDoc } from "firebase/firestore";
import { getApps, getApp } from 'firebase/app';
import { initializeApp } from "firebase/app";


const firebaseConfig = { 
  apiKey: "AIzaSyA5dgphkznom5xpTLAPOiJAUclUim4ozd0",
  authDomain: "pontinhosc-39cf0.firebaseapp.com",
  projectId: "pontinhosc-39cf0",
  storageBucket: "pontinhosc-39cf0.appspot.com", 
  messagingSenderId: "960544111866",
  appId: "1:960544111866:web:8597018369d4ec200e1d43"
};

!getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const querySnapshot = await getDocs(collection(db, "compras"));
      const purchases = [];

      querySnapshot.forEach((doc) => {
        purchases.push(doc.data());
      });

      res.status(200).json(purchases);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
  } else {
    res.status(405).send('Method not allowed');
  }
};
