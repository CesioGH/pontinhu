import CardResumo from "../../src/components/CardResumo"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '../../src/lib/firebase';
import HeaderUsuario from "../../src/components/HeaderUsuario"
import { UserAuthProvider } from '../../src/contexts/UserAuthContext';

export default function Geral(){
    
    const [resumos, setResumos] = useState([]);

  useEffect(() => {
    const fetchResumos = async () => {
      const snapshot = await db.collection('resumos').get();
      const resumos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResumos(resumos);
    };
 
    fetchResumos();
  }, []);
    
    return(
<UserAuthProvider>
    <div>
        <HeaderUsuario/>


            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}> 
              <h1>Resumos</h1>
                <div style={{display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"space-evenly"}}>
                    {resumos.map(resumo => (
                    <CardResumo key={resumo.id} resumo={resumo} />
                    ))}
                </div>
            </div>

    </div>
    </UserAuthProvider>
    )

}
    
