import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '../src/lib/firebase';
import { useRouter } from 'next/router';
import Footer from "../src/components/Footer"
import HeaderLandingPage from "../src/components/HeaderLandingPage"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useUserAuth } from '../src/contexts/UserAuthContext'; // Ajuste o caminho conforme necessário

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

const HomePage = () => {
  const { darkMode, setDarkMode } = useUserAuth();

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
   <div style={{display:"flex",flexDirection:"column", alignItems:"center"}}>
      <h1 style={{color:"GrayText"}}>PONTINHOS</h1>
      <div style={{display:"flex", flexDirection:"row",gap:"5px"}}>
  
        <Link style={{display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width:"100px",height:"100px",
          borderWidth:"2px",borderStyle:"solid",borderRadius:"3px"}}
        href="/Geral/">
          RESUMOS
        </Link>

        

      </div>

      
<Footer/>
    </div>
    </div>
        </ThemeProvider>
  );
};



export default HomePage;