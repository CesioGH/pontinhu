// pages/Dashboard.js

import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [purchases, setPurchases] = useState([]);
  const [totalConfirmed, setTotalConfirmed] = useState(0);

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
    <div>
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
