import React, { useState, useEffect } from 'react';
import styles from '../../styles/Card.module.css'
import { useAuth } from '../../src/contexts/AuthContext'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/lib/firebase'
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import firebase from 'firebase/compat/app';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#333"  
    }
  },
});

export default function CardResumo({ cardSize,resumo, isDescriptionOpen, onToggleDescription, darkMode }) {
  const [step, setStep] = useState(0);
  const { currentUser } = useAuth();
  const [orderId, setOrderId] = useState(null);
  const [boughtResumes, setBoughtResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, "usuarios", currentUser.email);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setBoughtResumes(doc.data().resumosComprados);
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleClick = async () => {
    if (!currentUser) {
      const choice = confirm("Por favor, faça login primeiro. Deseja ir para a página de login?");
      if (choice) {
        router.push('/loginPage');
      }
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

  const cardWidth = 180 * (cardSize / 100);
const cardStyle = {
  width: `${cardWidth}px`,
  maxWidth: `${cardWidth}px`,
};

const fontSize = 1 * (cardSize / 100); // Ajuste conforme necessário

  

  return (
    <div className={`${styles.card} ${darkMode ? styles['card-dark'] : styles['card-light']}`} style={cardStyle}>      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <img className={styles.thumbnail} src={resumo.thumbnail} alt={resumo.nome} />
          <h3 style={{color:"GrayText"}}>{resumo.nome}</h3>
          <h3 style={{color:"GrayText"}}>{resumo.assunto}</h3>
          <div style={{display:"flex", alignItems:"center", gap:"3px", justifyContent:"space-between"}}>
            <p style={{color:"GrayText"}} className={styles.preco}>R${resumo.valor}</p>
            {isBought ? 
              <h3 
                className={styles.comprado} 
                onClick={() => router.push('/meusResumos')} 
                style={{fontSize: `${fontSize}rem`}}
              >
                Comprado
              </h3>
              :
              <button onClick={handleClick}>Comprar</button>
            }
          </div>
          <div onClick={onToggleDescription} className={`${styles['dropdown-container']}`}>
            <p style={{color:"GrayText", borderStyle:"solid", borderColor:"GrayText", padding:"3px", borderRadius:"5px"}}>Ver Descrição</p>
            <div className={`${styles.dropdown} ${isDescriptionOpen ? styles['dropdown-open'] : ''} ${darkMode ? styles['dropdown-dark'] : ''}`}>
              {resumo.descricao}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
