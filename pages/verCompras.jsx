// pages/Dashboard.js
import HeaderAdm from "../src/components/HeaderAdm"
import { useState, useEffect, useContext } from 'react';
import { useUserAuth } from '../src/contexts/UserAuthContext'
import { createTheme, ThemeProvider } from '@mui/material/styles';

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


const Dashboard = () => {
  const [purchases, setPurchases] = useState([]);
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const { darkMode, setDarkMode , toggleDarkMode} = useUserAuth();

  useEffect(() => {
      document.body.style.backgroundColor = darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default;
  }, [darkMode]);

 

  useEffect(() => {
    // Fetch the purchases data when the component mounts
    fetch('/api/getPurchases')
      .then(response => response.json())
      .then(data => {
        setPurchases(data);

        // Calculate the total for confirmed purchases
        const total = data
          .filter(purchase => purchase.status === 'confirmed')
          .reduce((acc, purchase) => acc + purchase.preco, 0); 
        
        setTotalConfirmed(total);
      });
  }, []);

  
  
  return (
    <div style={{color:"grey"}}>
      <HeaderAdm/>
      <h1>Dashboard Administrador</h1>
      
      <h2>Total Confirmed Purchases: ${totalConfirmed}</h2>
      
      <h2>History:</h2>
      <ul>
        {purchases.map((purchase, index) => (
          <li key={index}>
            {purchase.resumoNome} - {purchase.emailComprador} - ${purchase.preco} - {purchase.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
