// adminDashboard.js

import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { getDocs, collection, getFirestore, setDoc, doc } from "firebase/firestore";
import { useAuth } from '../src/contexts/AuthContext';
import { useRouter } from 'next/router';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [response, setResponse] = useState('');
  const { currentUser } = useAuth();
  const router = useRouter();

  const db = getFirestore();

 if (!currentUser || currentUser.uid !== "lJQm2PbwBFaoFHvOPGkoz3jU5rF3") {
    router.push('/login');
    return null;
  }

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const msgs = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setMessages(msgs);
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
    setMessages(prevMessages => prevMessages.map(msg => msg.id === selectedMessage.id ? {...msg, adminResponse: response} : msg));
    setSelectedMessage(null);
    setResponse('');
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      <Paper variant="outlined" style={{maxHeight: 400, overflow: 'auto', marginRight: 20, width: '45%', float: 'left'}}>
        <List>
          {messages.map((msg, index) => (
            <ListItem button onClick={() => handleSelectMessage(msg)} key={index}>
              <ListItemText primary={msg.content} secondary={msg.userEmail} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {selectedMessage && (
        <Box style={{width: '45%', float: 'right'}}>
          <Typography variant="h6">Respond to: {selectedMessage.userEmail}</Typography>
          <Typography gutterBottom>{selectedMessage.content}</Typography>

          <form onSubmit={handleSendResponse}>
            <TextField 
              fullWidth 
              variant="outlined" 
              label="Your response" 
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              style={{marginTop: 20}}
            />
            <Button variant="contained" color="primary" type="submit" style={{marginTop: 10}}>Send Response</Button>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;
