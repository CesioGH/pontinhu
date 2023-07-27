import CardResumo from "../../src/components/CardResumo"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '../../src/lib/firebase';
import HeaderUsuario from "../../src/components/HeaderUsuario"
import { UserAuthProvider } from '../../src/contexts/UserAuthContext';
import Footer from "../../src/components/Footer";

export default function Geral(){
    
    const [resumos, setResumos] = useState([]);
    const [openedCard, setOpenedCard] = useState(null); // Adicionado para o dropdown

  useEffect(() => {
    const fetchResumos = async () => {
      const snapshot = await db.collection('resumos').get();
      const resumos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResumos(resumos);
    };
 
    fetchResumos();
  }, []);

  // Função para lidar com o dropdown
  const handleToggleDescription = (nome) => {
    setOpenedCard(openedCard === nome ? null : nome);
  }

  return(
    <UserAuthProvider>
      <div>
        <HeaderUsuario/>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}> 
          <h1>Resumos</h1>
          <div style={{display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"space-evenly"}}>
            {resumos.map(resumo => (
              <CardResumo 
                key={resumo.id} 
                resumo={resumo}
                isDescriptionOpen={openedCard === resumo.nome} // Adicionado para o dropdown
                onToggleDescription={() => handleToggleDescription(resumo.nome)} // Adicionado para o dropdown
              />
            ))}
          </div>
        </div>
        <Footer/>
      </div>
    </UserAuthProvider>
  )
}
