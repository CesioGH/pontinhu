import {db } from "../lib/firebase"
import { useEffect, useState } from 'react';


export default function ResumosComApagar ({resumo, index}){

  const [editing, setEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(resumo.descricao);
  const [editedPrice, setEditedPrice] = useState(resumo.valor);


  const handleEdit = async () => {
    if (editing) {
        // Aqui nós atualizamos o Firestore com os novos valores
        await db.collection('resumos').doc(resumo.id).update({
            descricao: editedDescription,
            valor: editedPrice
        });
    }
    setEditing(!editing);
}


      const backgroundColor = index % 2 === 0 ? "#E7D8E9" : "#C9B5D4"

      return (
        <div style={{ backgroundColor, justifyContent: "space-between", display: "flex", borderRadius: "5px", gap: "10px", margin: "10px", padding: "10px" }}>
    
            <img style={{ width: "40px" }} src={resumo.thumbnail} alt={resumo.nome} />
            <h2 style={{color:"grey"}}>{resumo.nome}</h2>
    
            <h2 style={{color:"grey"}}>{resumo.assunto}</h2>
    
            {editing ? (
                <input
                    type="text"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                />
            ) : (
                <h2 style={{color:"grey"}}>{resumo.descricao}</h2>
            )}
    
            {editing ? (
                <input
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                />
            ) : (
                <h2 style={{color:"grey"}}>{resumo.valor}</h2>
            )}
    
            <button style={{height:"30px"}} onClick={handleEdit}>{editing ? "Salvar" : "Editar"}</button>
    
        </div>
    );
    
}