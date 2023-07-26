import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../src/contexts/UserAuthContext'
import { useRouter } from 'next/router';
import CardResumoComprado from '../src/components/CardResumoComprado'
import HeaderUsuario from '../src/components/HeaderUsuario';

const MeusResumosPage = () => {
  const { currentUser } = useUserAuth();
  const router = useRouter();

  const [resumosComprados, setResumosComprados] = useState([]);

  

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
      return;
    }
  
    const fetchResumosComprados = async () => {
      try {
        const response = await fetch(`/api/get_resumos?userId=${currentUser.uid}`);
        const resumos = await response.json();
        setResumosComprados(resumos);
      } catch (error) {
        console.error(error);
      }
    }
  
    fetchResumosComprados();
  }, [currentUser, router]); 

  return (
    <div>
        <HeaderUsuario/>
      <h1>Meus Resumos</h1>
      {resumosComprados.map(resumo => <CardResumoComprado key={resumo.id} resumo={resumo} />)}
    </div>
  )
};

export default MeusResumosPage;
