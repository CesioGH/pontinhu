import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebase";
import { collection, getDocs, where, doc, updateDoc, query, arrayUnion } from "firebase/firestore";
import { Button, Checkbox, TextField, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { color, styled } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClickAwayListener from '@mui/material/ClickAwayListener';

export default function ResumosComEditar({ resumo, index }) {
  const [editing, setEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(resumo.descricao);
  const [editedPrice, setEditedPrice] = useState(resumo.valor);
  const [colecoesDoResumo, setColecoesDoResumo] = useState([]);
  const [colecoesDisponiveis, setColecoesDisponiveis] = useState([]);
  const [colecoesSelecionadas, setColecoesSelecionadas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const buscarColecoes = async () => {
      const q = query(collection(db, 'colecoes'), where('resumos', 'array-contains', resumo.id));
      const colecoes = await getDocs(q);
      
      const colecoesArray = [];
      colecoes.forEach(doc => {
        colecoesArray.push(doc.data().nome);
      });
      
      setColecoesDoResumo(colecoesArray);
    }

    const buscarTodasColecoes = async () => {
      const colecoes = await getDocs(collection(db, 'colecoes'));
      
      const colecoesArray = [];
      colecoes.forEach(doc => {
        colecoesArray.push({ id: doc.id, nome: doc.data().nome });
      });
      
      setColecoesDisponiveis(colecoesArray);
    }

    buscarColecoes();
    buscarTodasColecoes();
  }, [resumo.id]);

  const toggleColecao = (colecaoId) => {
    if (colecoesSelecionadas.includes(colecaoId)) {
      setColecoesSelecionadas(prev => prev.filter(id => id !== colecaoId));
    } else {
      setColecoesSelecionadas(prev => [...prev, colecaoId]);
    }
  }

  const dropdownStyle = {
    position: 'absolute',
    top: '100%', 
    
    width: 'auto',
    backgroundColor: 'white',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
    zIndex: 10, 
    borderRadius: '5px',
    padding: '5px',
    textAlign: 'right', 
    color:"grey"
  };
  
  const confirmarAdicao = async () => {
    const confirmacao = window.confirm(`Você quer adicionar o resumo ${resumo.nome} às coleções ${colecoesSelecionadas.map(id => colecoesDisponiveis.find(colecao => colecao.id === id).nome).join(", ")}?`);
    
    if (confirmacao) {
      for (let colecaoId of colecoesSelecionadas) {
        await updateDoc(doc(db, 'colecoes', colecaoId), {
          resumos: arrayUnion(resumo.id)
        });
      }
      setColecoesSelecionadas([]);
      setIsModalOpen(false);
    }
  }

  const handleEdit = async () => {
    if (editing) {
      await updateDoc(doc(db, 'resumos', resumo.id), {
        descricao: editedDescription,
        valor: editedPrice
      });
    }
    setEditing(!editing);
  }

  const CustomCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    display: "flex",
    borderRadius: "5px",
    margin: "10px",
    padding: "0px",
    width: "200px",
    height: "auto",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    '&:hover': {
      transform: "scale(1.03)",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
    },
    [theme.breakpoints.down('sm')]: {
      width: "165px", 
    },
    [theme.breakpoints.up('md')]: {
      width: "220px", 
    },
    [theme.breakpoints.up('lg')]: {
      width: "250px",
    }
  }));
  
  
  const Description = styled('p')({
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical"
  });
  
  const backgroundColor = index % 2 === 0 ? "#E7D8E9" : "#C9B5D4"; 

  return (
    <CustomCard style={{ backgroundColor }}>
      <CardContent >
        <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <img style={{ width: "40px", height: "50px" }} src={resumo.thumbnail} alt={resumo.nome} />
          
          <IconButton size="small" style={{ zIndex: 5 }} onClick={() => setShowDropdown(prev => !prev)}>
            <ExpandMoreIcon />
          </IconButton>
        </div>

        {showDropdown && (
          <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
            <div style={dropdownStyle}>
              {colecoesDoResumo.length === 0 ? (
                <p>Nenhuma coleção</p>
              ) : (
                colecoesDoResumo.map(colecaoNome => <p key={colecaoNome}>-{colecaoNome}</p>)
              )}
            </div>
          </ClickAwayListener>
        )}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center", gap:"0px"}}>
        <p>{resumo.nome}</p>
        <p>{resumo.assunto}</p>

        {editing ? (
          <TextField value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} label="Descrição" />
        ) : (
          <Description>{resumo.descricao}</Description>
        )}

        {editing ? (
          <TextField value={editedPrice} onChange={(e) => setEditedPrice(e.target.value)} label="Valor" type="number" />
        ) : (
          <p>R$ {resumo.valor}</p>
        )}
        </div>
      </CardContent>
      <CardActions style={{display:"flex", flexDirection:"column"}}>
        <Button color="secondary" onClick={() => setIsModalOpen(true)}>Adicionar às Coleções</Button>
        <Button color="primary" onClick={handleEdit}>{editing ? "Confirmar" : "Editar"}</Button>
      </CardActions>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Adicionar à Coleção</DialogTitle>
        <DialogContent>
          <List>
            {colecoesDisponiveis.map(colecao => (
              <ListItem key={colecao.id}>
                <ListItemText primary={colecao.nome} />
                <ListItemSecondaryAction>
                  <Checkbox 
                    edge="end"
                    checked={colecoesSelecionadas.includes(colecao.id)}
                    onChange={() => toggleColecao(colecao.id)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmarAdicao} color="primary">Adicionar</Button>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">Cancelar</Button>
        </DialogActions>
      </Dialog>
    </CustomCard>
  );
}