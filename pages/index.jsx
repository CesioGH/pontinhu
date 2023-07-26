import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '../src/lib/firebase';

const HomePage = () => {
  

  return (
    <div style={{display:"flex",flexDirection:"column", alignItems:"center"}}>
<h1>PONTINHOS</h1>
<div style={{display:"flex", flexDirection:"row",gap:"5px"}}>
  
  <Link style={{display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width:"100px",height:"100px",
      borderWidth:"2px",borderStyle:"solid",borderRadius:"3px"}}
   href="/Geral/">
     GERAL
  </Link>

  <Link style={{display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width:"100px",height:"100px",
      borderWidth:"2px",borderStyle:"solid",borderRadius:"3px"}}
   href="/Unirv/">
     UNIRV
  </Link>

</div>


      <Link href="/login">
        Login
      </Link>

     
    </div>
  );
};

export default HomePage;
