import { doc, getFirestore, getDoc ,addDoc, collection, getDocs, query, where, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getApps, getApp } from 'firebase/app';
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: 'APP_USR-7064583763861576-081514-dc282a00528f9dd4bf748edabb8d7085-157955641' 
});

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
  if (req.method === 'POST') {
    const { title, unitPrice, email, external_reference } = req.body;

    
    const preference = {
      items: [
        {
          title: title,
          quantity: 1,
          unit_price: unitPrice,
        },
      ],
      payer: {
        email: email,
      },
      external_reference: external_reference,
      payment_methods: { 
        excluded_payment_types: [
          { id: 'ticket' },
          { id: 'atm' },
          { id: 'credit_card' },
          { id: 'debit_card' },
        ]
       
      },
      back_urls: { 
        success: 'https://pontinhu-2.vercel.app/Geral', 
        pending: 'https://pontinhu-2.vercel.app/Geral',
        failure: 'https://pontinhu-2.vercel.app/Geral',
      },
      auto_return: 'approved',
    };
    

    try {
     
      const payment = await mercadopago.preferences.create(preference);

      
      const compra = {
        resumoNome: title,
        emailComprador: email,
        preco: parseFloat(unitPrice),
        dataCriacaoPreferencia: new Date().toISOString(),
        dataConfirmacaoPagamento: 'not paid yet',
        status: 'pendente',
        external_reference: external_reference,
      };

      const q = query(collection(db, "compras"), where("external_reference", "==", external_reference));

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        for (let doc of querySnapshot.docs) {
          const docData = doc.data();
          if (docData.status === 'confirmed') {
            res.status(400).send('Você já comprou este produto');
            return; 
          } else {
            await setDoc(doc.ref, compra, { merge: true });
          }
        }
      } else {
        await addDoc(collection(db, "compras"), compra);
      }
      

      const userDoc = doc(db, "usuarios", email);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        await setDoc(userDoc, { email: email, registro: new Date().toISOString(), resumosComprados: [] });
      }

      res.status(200).json({ 
        id: payment.body.id, 
        url: payment.body.init_point ,
        external_reference: preference.external_reference 
      });

    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
  } else {
    res.status(405).send('Method not allowed');
  }
};
