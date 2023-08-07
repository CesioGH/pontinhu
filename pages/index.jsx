import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '../src/lib/firebase';
import { useRouter } from 'next/router';
import Footer from "../src/components/Footer"
import HeaderLandingPage from "../src/components/HeaderLandingPage"

const HomePage = ({ darkMode, toggleDarkMode }) => {

  return (
    <div>
      <HeaderLandingPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />    <div style={{display:"flex",flexDirection:"column", alignItems:"center"}}>
      <h1>PONTINHOS</h1>
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
  );
};



export default HomePage;
