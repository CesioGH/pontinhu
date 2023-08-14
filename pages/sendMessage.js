// sendMessage.js

import { useEffect, useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { doc, addDoc, getDocs, collection, getFirestore, query, where } from "firebase/firestore";
import { Box, Button, TextField, Typography, Paper, List, ListItem, ListItemText, Avatar } from '@mui/material';

const SendMessage = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    if (currentUser) {
      const fetchChat = async () => {
        const q = query(collection(db, 'messages'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        const messages = querySnapshot.docs.map(doc => doc.data());
        setChat(messages);
      };

      fetchChat();
    }
  }, [currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message) return;

    const newMessage = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      content: message,
      timestamp: new Date().toISOString(),
      adminResponse: null,
    };

    await addDoc(collection(db, "messages"), newMessage);

    // Reset the message input after sending
    setMessage('');

    // Refresh the chat
    setChat(prevChat => [...prevChat, newMessage]);
  };

  return (
    <Box p={4}>
    <Typography variant="h4" gutterBottom>Chat with Admin</Typography>

    <Paper variant="outlined" style={{maxHeight: 400, overflow: 'auto'}}>
      <List>
        {chat.map((msg, index) => (
          <ListItem key={index}>
            <Avatar src={currentUser.photoURL} alt="User image" />
            <ListItemText primary={msg.content} secondary={msg.adminResponse || "Awaiting response..."} />
          </ListItem>
        ))}
      </List>
    </Paper>

      <form onSubmit={handleSendMessage}>
        <TextField 
          fullWidth 
          variant="outlined" 
          label="escreva aqui" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{marginTop: 20}}
        />
        <Button variant="contained" color="primary" type="submit" style={{marginTop: 10}}>Send</Button>
      </form>
    </Box>
  );
};

export default SendMessage;
