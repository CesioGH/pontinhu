// Importações de bibliotecas necessárias
import React from 'react';
import styles from '../../styles/Card.module.css';

// Componente CardResumoComprado
const CardResumoComprado = ({ resumo }) => {
  return (
    <div className={styles.card}>
      <img className={styles.thumbnail} src={resumo.thumbnail} alt={resumo.nome} />
      <h2>{resumo.nome}</h2>
      <h2>{resumo.assunto}</h2>
      <p>{resumo.descricao}</p>
    </div>
  );
};

// Exportação do componente
export default CardResumoComprado;
