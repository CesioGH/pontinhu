import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { useUserAuth } from '../src/contexts/UserAuthContext';
import HeaderUsuario from "/src/components/HeaderUsuario";
import { UserAuthProvider } from '../src/contexts/UserAuthContext';
import { useRouter } from 'next/router';

const MeusResumos = () => {
  const { currentUser } = useUserAuth();
  const [boughtResumes, setBoughtResumes] = useState([]);
  const router = useRouter();

  const sanitizeId = (id) => {
    return id
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ç/g, "c")
      .replace(/ /g, "-")
      .toLowerCase();
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/Geral'); // redirect the user to homepage if not logged in
    } else {
      const userRef = doc(db, "usuarios", currentUser.email);
      const unsubscribe = onSnapshot(userRef, async (userDoc) => {
        if (userDoc.exists()) {
          const resumosComprados = userDoc.data().resumosComprados;
          const resumoDocs = await Promise.all(resumosComprados.map(nomeResumo => getDoc(doc(db, "resumos", sanitizeId(nomeResumo)))));
          const resumoData = resumoDocs.map((resumoDocSnapshot, index) => resumoDocSnapshot.exists() ? resumoDocSnapshot.data() : `Resumo não encontrado com o nome ${resumosComprados[index]}`);
          setBoughtResumes(resumoData);
        }
      });

      // Return a cleanup function that unsubscribes the listener when the component is unmounted
      return () => unsubscribe();
    }
  }, [currentUser]);

  return (
    <UserAuthProvider>
      <div>
        <HeaderUsuario/>
        <h1>Meus Resumos</h1>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {boughtResumes.map((resumo, index) => {
            return resumo ? (
              <div style={{borderStyle:"solid", display:"flex",flexDirection:"column",gap:"10px", justifyContent:"center", alignItems:"center" }} key={index}>
                <img style={{width:"150px"}} src={resumo.thumbnail} alt="thumbnail" />
                <h2>{resumo.nome}</h2>
                <h3>{resumo.assunto}</h3>
                <p>{resumo.descricao}</p>
                <a href={resumo.pdf}>Ver PDF</a>
              </div>
            ) : (
              <div key={index}>
                <p>Carregando...</p>
              </div>
            );
          })}
        </div>
      </div>
    </UserAuthProvider>
  )
}

export default MeusResumos;
