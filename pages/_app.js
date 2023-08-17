import Head from 'next/head';
import 'next/head';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '../src/contexts/AuthContext';
import { UserAuthProvider } from '../src/contexts/UserAuthContext';

function MyApp({ Component, pageProps }) {
  const savedDarkMode = typeof window !== 'undefined' ? localStorage.getItem("darkMode") : null;
  const [darkMode, setDarkMode] = useState(savedDarkMode ? JSON.parse(savedDarkMode) : false);

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

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => { 
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
               <Head>
          <link rel="shortcut icon" href="/favicon (1).ico" />   
         </Head>
      <CssBaseline />
      <UserAuthProvider>
        <AuthProvider>
          <Component {...pageProps} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </AuthProvider>
      </UserAuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
