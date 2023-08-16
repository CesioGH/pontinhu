import { getDoc , getFirestore, setDoc, collection, getDocs, query, where } from "firebase/firestore";
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
    const { id } = req.query;

    try {
      const payment = await mercadopago.payment.findById(id);
      const { status, external_reference } = payment.body;

      if (status === 'approved') {
        const [email, title] = external_reference.split("-");

        const q = query(collection(db, "compras"), where("external_reference", "==", external_reference));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          for (let doc of querySnapshot.docs) {
            await setDoc(doc.ref, { status: 'confirmed', dataConfirmacaoPagamento: new Date().toISOString() }, { merge: true });          }
        }

        const userQuery = query(collection(db, "usuarios"), where("email", "==", email));
        const userQuerySnapshot = await getDocs(userQuery);

        if (!userQuerySnapshot.empty) {
          const userDoc = userQuerySnapshot.docs[0];
          
          const currentResumos = userDoc.data().resumosComprados || [];

          currentResumos.push(title);

          await setDoc(userDoc.ref, { resumosComprados: currentResumos }, { merge: true });

          console.log(`Updated resumosComprados for user ${email}`);
        } else {
          console.log(`User document not found for email ${email}`);
        }

        const resumoQuery = query(collection(db, "resumos"), where("nome", "==", title));
        const resumoQuerySnapshot = await getDocs(resumoQuery);

        if (!resumoQuerySnapshot.empty) {
          const resumoDoc = resumoQuerySnapshot.docs[0];

          const currentCompradores = resumoDoc.data().compradores || [];

          currentCompradores.push(email);

          await setDoc(resumoDoc.ref, { compradores: currentCompradores }, { merge: true });

          console.log(`Updated compradores for resumo ${title}`);
        } else {
          console.log(`Resumo document not found for title ${title}`);
        }

        res.status(200).send('Updated successfully');
      } 
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
  } else {
    res.status(405).send('Method not allowed');
  }
}
