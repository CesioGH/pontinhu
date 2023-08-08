import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '../src/contexts/AuthContext';
import { UserAuthProvider } from '../src/contexts/UserAuthContext';

function MyApp({ Component, pageProps }) {
  // Puxar o modo escuro do localStorage
  const savedDarkMode = typeof window !== 'undefined' ? localStorage.getItem("darkMode") : null;
  const [darkMode, setDarkMode] = useState(savedDarkMode ? JSON.parse(savedDarkMode) : false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  // Armazene o modo escuro no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
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
