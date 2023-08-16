// adminDashboard.js

import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { getDocs, collection, getFirestore, setDoc, doc } from "firebase/firestore";
import { useAuth } from '../src/contexts/AuthContext';
import { useRouter } from 'next/router';
import HeaderAdm from "../src/components/HeaderAdm"

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [response, setResponse] = useState('');
  const { currentUser } = useAuth();
  const [counters, setCounters] = useState({ orange: 0, red: 0 });
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const msgs = querySnapshot.docs.map(doc => doc.data());

      let count = 0;
      msgs.forEach(msg => {
        if (!msg.adminResponse) count++;
      });

      setUnreadMessagesCount(count);
    };

    fetchUnreadMessagesCount();
  }, []);

  const router = useRouter();

  const db = getFirestore();

  useEffect(() => {
    if (!currentUser || currentUser.uid !== "lJQm2PbwBFaoFHvOPGkoz3jU5rF3") {
      router.push('/');
    }
  }, [currentUser, router]);
  

  useEffect(() => {
    const h4Element = document.querySelector('h4');
    const h4Color = h4Element ? window.getComputedStyle(h4Element).color : null;
    const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;

    if (h4Color === 'rgba(0, 0, 0, 0.87)' && bodyBackgroundColor === 'rgb(51, 51, 51)') {
      location.reload();
    } else if (h4Color === 'rgb(255, 255, 255)' && bodyBackgroundColor === 'rgb(245, 245, 245)') {
      location.reload();
    }
  }, []);

    const updateCounters = (msgs) => {
      let orangeCount = 0;
      let redCount = 0;
      
      msgs.forEach(message => {
          const color = getColor(message);
          if (color === 'orange') orangeCount++;
          if (color === 'red') redCount++;
      });

      setCounters({ orange: orangeCount, red: redCount });
    };


  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const msgs = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setMessages(msgs);
      updateCounters(msgs); 
    };

    fetchMessages();
  }, []);

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setResponse('');
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();

    if (!selectedMessage || !response) return;

    const messageDoc = doc(db, 'messages', selectedMessage.id);
    await setDoc(messageDoc, { adminResponse: response }, { merge: true });

    // Refresh messages list
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(msg => msg.id === selectedMessage.id ? {...msg, adminResponse: response} : msg);
      updateCounters(updatedMessages);
      return updatedMessages;
  });    setSelectedMessage(null);
    setResponse('');
  };

  const getColor = (message) => {
    // Se tem uma resposta
    if (message.adminResponse) return 'green';
  
    // Calcula a diferença de tempo
    const timeDiff = Date.now() - new Date(message.timestamp).getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
  
    // Se tiver mais de 24 horas
    if (hoursDiff > 24) return 'red';
  
    // Se não tiver resposta e tiver menos de 24 horas
    return 'orange';
  };
  
  const listItemTextStyle = {
    maxHeight: '50px',  // ou qualquer valor que se adeque ao que você deseja
    overflowY: 'auto'
  };
  

  return (
    <div>
            <HeaderAdm unreadCount={unreadMessagesCount} />
    <Box p={4}>
      <div style={{display:"flex", flexDirection:"column"}}>
      <Typography variant="h4" gutterBottom>Mensagens dos usuários</Typography>
      <Typography style={{display:"flex", flexDirection:"column"}} variant="h8" gutterBottom>
        <span style={{ marginLeft: '2px', color: 'orange' }}>Pendentes: {counters.orange}</span>
        <span style={{ marginLeft: '2px', color: 'red' }}> +24h: {counters.red}</span>
    </Typography>
    </div>

      <Paper variant="outlined" style={{maxHeight: 400, overflow: 'auto', marginRight: 20, width: '45%', float: 'left'}}>
        <List>
          {messages.map((msg, index) => (
            <ListItem 
            button 
            onClick={() => handleSelectMessage(msg)} 
            key={index} 
            style={{ color: getColor(msg), borderStyle:"solid", borderWidth:"1px", margin:"1px" }}
          >
            <ListItemText style={listItemTextStyle} secondary={msg.content} primary={msg.userEmail} />
          </ListItem>
          
          ))}
        </List>
      </Paper>

      {selectedMessage && (
        <Box style={{width: '45%', float: 'right'}}>
          <Typography variant="h6">Responda para: {selectedMessage.userEmail} :</Typography>
          <Typography style={{borderStyle:"solid", borderRadius:"10px", borderWidth:"1px", padding:"4px",margin:"1px"}} gutterBottom>{selectedMessage.content}</Typography>

          <form onSubmit={handleSendResponse}>
            <TextField 
              fullWidth 
              variant="outlined" 
              label="Sua resposta" 
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              style={{marginTop: 20}}
            />
            <Button variant="contained" color="primary" type="submit" style={{marginTop: 10}}>Enviar Resposta</Button>
          </form>
        </Box>
      )}
    </Box>
    </div>
  );
};

export const getTotalUnanswered = (counters) => counters.orange + counters.red;
export default AdminDashboard;
