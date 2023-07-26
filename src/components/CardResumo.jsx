import React, { useState, useEffect } from 'react';
import styles from '../../styles/Card.module.css'
import { useAuth } from '../../src/contexts/AuthContext'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/lib/firebase'

import firebase from 'firebase/compat/app';

export default function CardResumo ({ resumo }) {
  const [step, setStep] = useState(0);
  const { currentUser } = useAuth();
  const [orderId, setOrderId] = useState(null);
  const [boughtResumes, setBoughtResumes] = useState([]);

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
    }
  }

  const isBought = boughtResumes.includes(resumo.nome);

  return (
    <div className={styles.card} style={isBought ? { backgroundColor: 'green' } : null}>
      <img className={styles.thumbnail} src={resumo.thumbnail} alt={resumo.nome} />

      <>
        <h2>{resumo.nome}</h2>
        <h2>{resumo.assunto}</h2>

        <div style={{display:"flex", gap:"5px"}}>
          <h2>{resumo.valor}</h2>
          {isBought ? <h3>Comprado</h3> : <button onClick={handleClick}>Comprar</button>}
        </div>

        <p>{resumo.descricao}</p>
      </>
    </div>
  );
};
