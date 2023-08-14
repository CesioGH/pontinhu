import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '../src/lib/firebase';
import { useRouter } from 'next/router';
import Footer from "../src/components/Footer"
import HeaderLandingPage from "../src/components/HeaderLandingPage"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useUserAuth } from '../src/contexts/UserAuthContext'; // Ajuste o caminho conforme necessário
import LandingPageHero from '../src/components/LandingPageHero';

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
  const router = useRouter();

  useEffect(() => {
    const h2Element = document.querySelector('h2');

    const h2Color = h2Element ? window.getComputedStyle(h2Element).color : null;

    const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;

    if (h2Color === 'rgba(0, 0, 0, 0.87)' && bodyBackgroundColor === 'rgb(51, 51, 51)') {
      location.reload();
    } else if (h2Color === 'rgb(255, 255, 255)' && bodyBackgroundColor === 'rgb(245, 245, 245)') {
      location.reload();
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };


  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default;
}, [darkMode]);


  return (
          <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <HeaderLandingPage toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            <LandingPageHero/>
   
    
   

      
<Footer/>
    
    
        </ThemeProvider>
  );
};



export default HomePage;