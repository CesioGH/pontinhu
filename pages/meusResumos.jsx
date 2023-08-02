import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { useUserAuth } from '../src/contexts/UserAuthContext';
import HeaderUsuario from "/src/components/HeaderUsuario";
import { UserAuthProvider } from '../src/contexts/UserAuthContext';
import { useRouter } from 'next/router';
import styles from '../styles/MeusResumos.module.css';

const MeusResumos = () => {
  const { currentUser } = useUserAuth();
  const [boughtResumes, setBoughtResumes] = useState([]);
  const [pdfSrc, setPdfSrc] = useState(null);
  const [openDescriptionIndex, setOpenDescriptionIndex] = useState(null);
  const [activeResume, setActiveResume] = useState(null);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const sanitizeId = (id) => {
    return id
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ç/g, "c")
      .replace(/ /g, "-")
      .toLowerCase();
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/Geral');
    } else {
      const userRef = doc(db, "usuarios", currentUser.email);
      const unsubscribe = onSnapshot(userRef, async (userDoc) => {
        if (userDoc.exists()) {
          const resumosComprados = userDoc.data().resumosComprados;
          const resumoDocs = await Promise.all(resumosComprados.map(nomeResumo => getDoc(doc(db, "resumos", sanitizeId(nomeResumo)))));
          const resumoData = resumoDocs.map((resumoDocSnapshot, index) => resumoDocSnapshot.exists() ? resumoDocSnapshot.data() : `Resumo não encontrado com o nome ${resumosComprados[index]}`);
          setBoughtResumes(resumoData);
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const toggleDescription = (index) => {
    if (index === openDescriptionIndex) {
      setOpenDescriptionIndex(null);
    } else {
      setOpenDescriptionIndex(index);
    }
  };

  return (
    <UserAuthProvider>
      <div style={{
          marginTop:"130px",
          display:"flex", 
          flexDirection:"column",
          alignItems:"center",
          justifyContent:"center", 
          backgroundColor:"green",
          
       
       }
       }>
      <HeaderUsuario search={searchTerm} setSearch={setSearchTerm} />

        <h1>Meus Resumos</h1>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px", flexWrap: "wrap", justifyContent:"space-evenly" }}>
            {activeResume ? (
              <div className={styles.cardMeuResumo}>
                <img style={{ width: '100%', height: 'auto', objectFit: 'cover' }} src={activeResume.thumbnail} alt="thumbnail" />
                <h2>{activeResume.nome}</h2>
                <h3>{activeResume.assunto}</h3>
                <div className={styles['dropdown-container']} onClick={() => toggleDescription(activeResume)}>
                  <div className={`${styles.dropdown} ${openDescriptionIndex === activeResume ? styles['dropdown-show'] : ''}`}>{activeResume.descricao}</div>
                  <p>Descrição</p>
                  <button onClick={() => {
                    setPdfSrc(activeResume.pdf);
                    setActiveResume(null);
                  }}>Ver PDF</button>
                </div>
              </div>
            ) : (
              boughtResumes
                .filter((resumo) => {
                  if (resumo) {
                    const name = resumo.nome.toLowerCase();
                    const subject = resumo.assunto.toLowerCase();
                    const description = resumo.descricao.toLowerCase();
                    const term = searchTerm.toLowerCase();
  
                    return name.includes(term) || subject.includes(term) || description.includes(term);
                  }
                  return false;
                })
                .map((resumo, index) => {
                  return resumo ? (
                    <div style={{
                      
                      display:"flex", 
                      flexDirection:"column",
                      alignItems:"center",
                      justifyContent:"center", 
                      backgroundColor:"grey",
                      
                   
                   }}

                    className={styles.cardMeuResumo} key={index}>
                      <img style={{ width: '100%', height: 'auto', objectFit: 'cover' }} src={resumo.thumbnail} alt="thumbnail" />
                      <h2>{resumo.nome}</h2>
                      <h3>{resumo.assunto}</h3>
                      <div className={styles['dropdown-container']} onClick={() => toggleDescription(index)}>
                        <div className={`${styles.dropdown} ${openDescriptionIndex === index ? styles['dropdown-show'] : ''}`}>{resumo.descricao}</div>
                        <p>Descrição</p>
                        <button onClick={() => {
                          setPdfSrc(resumo.pdf);
                          setActiveResume(resumo);
                        }}>Ver PDF</button>
                      </div>
                    </div>
                  ) : (
                    <div key={index}>
                      <p>Carregando...</p>
                    </div>
                  );
                })
            )}
          </div>
          {activeResume && <button style={{ flex: "0 0 auto", width: "15vw", padding: "2px" }} onClick={() => setActiveResume(null)}>Ver meus outros resumos</button>}
        </div>
        <br />
        {pdfSrc && (
          <div style={{ width: '100%', height: '100vh' }}>
            <iframe src={pdfSrc} width="100%" height="100%" style={{ border: 'none' }}></iframe>
          </div>
        )}
      </div>
    </UserAuthProvider>
  )
  
}

export default MeusResumos;
