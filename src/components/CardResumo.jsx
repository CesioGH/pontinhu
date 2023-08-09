import React, { useState, useEffect } from 'react';
import styles from '../../styles/Card.module.css'
import { useAuth } from '../../src/contexts/AuthContext'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/lib/firebase'
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';


import firebase from 'firebase/compat/app';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#333"  
    }
  },
});

export default function CardResumo ({ resumo, isDescriptionOpen, onToggleDescription, darkMode  }) {
  const [step, setStep] = useState(0);
  const { currentUser } = useAuth();
  const [orderId, setOrderId] = useState(null);
  const [boughtResumes, setBoughtResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, "usuarios", currentUser.email);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setBoughtResumes(doc.data().resumosComprados);
        }
      });

      // Retornar uma função de limpeza que desinscreve o listener quando o componente é desmontado
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleClick = async () => {
    if (!currentUser) {
      alert('Por favor, faça login primeiro.');
      return;
    }
  
    const confirmation = window.confirm(`Você deseja comprar o resumo ${resumo.nome} por ${resumo.valor} reais?`);
    if (!confirmation) {
      return;
    }
  
    setIsLoading(true);  
  
    try {
      const response = await fetch('/api/create_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: resumo.nome, 
          quantity: 1, 
          unitPrice: parseFloat(resumo.valor), 
          email: currentUser.email,
          external_reference: `${currentUser.email}-${resumo.nome}`, 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setOrderId(data.id);
        window.location.href = data.url;
      } else {
        alert('Erro ao processar o pedido. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao processar o pedido. Por favor, tente novamente.');
    } finally {
      setIsLoading(false); 
    }
  }

  const isBought = boughtResumes.includes(resumo.nome);

  return (
<div className={`${styles.card} ${darkMode ? styles['card-dark'] : styles['card-light']}`} >      {isLoading ? (
        <CircularProgress  />
      ) : (
        <>
          <img className={styles.thumbnail} src={resumo.thumbnail} alt={resumo.nome} />
  
          <h3 style={{color:"GrayText"}}>{resumo.nome}</h3>
          <h3 style={{color:"GrayText"}}>{resumo.assunto}</h3>
  
          <div style={{display:"flex", alignItems:"center", gap:"3px", justifyContent:"space-between"}}>
            <p style={{color:"GrayText"}} className={styles.preco}>R${resumo.valor}</p>
            {isBought ? <Link href="/meusResumos" passHref> <h3 className={styles.comprado}>Comprado</h3> </Link> : <button onClick={handleClick}>Comprar</button>}
          </div>
  
          <div 
    onClick={onToggleDescription} 
    className={`${styles['dropdown-container']}`}
>
    <p style={{color:"GrayText", borderStyle:"solid", borderColor:"GrayText", padding:"3px", borderRadius:"5px"}}>Ver Descrição</p>
    <div 
        className={`${styles.dropdown} 
        ${isDescriptionOpen ? styles['dropdown-open'] : ''} 
        ${darkMode ? styles['dropdown-dark'] : ''}`} 
    >
        {resumo.descricao}
    </div>
</div>

        </>
      )}
    </div>
  );
  

};
