// sendMessage.js

import { useEffect, useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { doc, addDoc, getDocs, collection, getFirestore, query, where } from "firebase/firestore";
import { Box, Button, TextField, Typography, Paper, List, ListItem, ListItemText, Avatar } from '@mui/material';
import HeaderLandingPage from '../src/components/HeaderLandingPage';
import { useUserAuth } from '../src/contexts/UserAuthContext'; // Ajuste o caminho conforme necessário
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import MessageIcon from '@mui/icons-material/Message';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#333"
    }
  },
});

const lightTheme = createTheme({ 
  palette: {
    mode: 'light',
    background: {
      default: "#f5f5f5"
    }
  },
});

const SendMessage = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const { darkMode, setDarkMode } = useUserAuth();

  const router = useRouter();
  const db = getFirestore();

  

  useEffect(() => {
    if (!currentUser) {
      router.push('/Geral');
    }
  }, [currentUser]);
  

  useEffect(() => {
    const lastSent = localStorage.getItem("lastSent");
    if (lastSent) {
        const diffInSeconds = Math.round((Date.now() - lastSent) / 1000);
        if (diffInSeconds < 3600) {
          setTimeLeft(3600 - diffInSeconds);
        }
    }
  }, []); 
  


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

  useEffect(() => {
    let timerInterval;
    if (timeLeft !== null) {
      timerInterval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 2) {
            clearInterval(timerInterval);
            return null;
          }
          return prevTime - 2;
        });
      }, 2000);
    }
  
    return () => clearInterval(timerInterval);
  }, [timeLeft]);
  

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
    localStorage.setItem("lastSent", Date.now());
    setTimeLeft(3600);  // 1 hora em segundos
  };

  const formatTime = (secondsLeft) => {
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
      document.body.style.backgroundColor = darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default;
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>

    <div>
    <HeaderLandingPage toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    <Box p={4}>
    <Typography variant="h4" color="grey" gutterBottom>Envie dúvidas e/ou sugestões</Typography>
    <Typography variant="h6" color="grey" gutterBottom>Responderemos em menos de 24 horas</Typography>

    <form onSubmit={handleSendMessage}>
        <TextField 
          fullWidth 
          variant="outlined" 
          label="escreva aqui" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{marginTop: 20}}
        />
        {
          timeLeft === null ? (
            <Button variant="contained" color="primary" type="submit" style={{marginTop: 10}}>Enviar</Button>
          ) : (
            <Button variant="contained" color="secondary" disabled style={{marginTop: 10}}>{formatTime(timeLeft)}</Button>
          )
        }
    </form>
        <br></br>
    <Paper variant="outlined" style={{maxHeight: 400, overflow: 'auto'}}>
      <List>
        {chat.map((msg, index) => (
          <ListItem key={index}>
           <MessageIcon />
          <ListItemText
              primary={
                  <Typography style={{ borderStyle:"solid",borderRadius:"9px", padding:"3px", margin:"3px" ,fontWeight: 'bold', color:"grey" }}>
                      {msg.content}
                  </Typography>
              }
              secondary={
                  msg.adminResponse ? (
                      <Typography style={{ borderStyle:"solid",borderRadius:"9px",marginLeft:"8px",padding:"3px",color: 'green' }}>
                          {msg.adminResponse}
                      </Typography>
                  ) : (
                      <Typography style={{ marginLeft:"4px",color: 'red' }}>
                          aguardando resposta...
                      </Typography>
                  )
              }
          />
      </ListItem>
        ))}
      </List>
    </Paper>

      
    </Box>
    </div>
    </ThemeProvider>
  );
};

export default SendMessage;
