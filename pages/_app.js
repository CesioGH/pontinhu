import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '../src/contexts/AuthContext';
import { UserAuthProvider } from '../src/contexts/UserAuthContext';

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

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
