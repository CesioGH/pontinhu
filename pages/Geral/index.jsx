import CardResumo from "../../src/components/CardResumo";
import Link from 'next/link';
import { useEffect, useState } from 'react'; 
import { db } from '../../src/lib/firebase';
import HeaderUsuario from "../../src/components/HeaderUsuario";
import { UserAuthProvider } from '../../src/contexts/UserAuthContext';
import Footer from "../../src/components/Footer";
import Fuse from 'fuse.js';

export default function Geral({ darkMode, toggleDarkMode }){
    
    const [resumos, setResumos] = useState([]);
    const [openedCard, setOpenedCard] = useState(null); 
    const [search, setSearch] = useState("");

    

    useEffect(() => {
        const fetchResumos = async () => {
            const snapshot = await db.collection('resumos').get();
            const resumos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setResumos(resumos);
        };
        fetchResumos();
    }, []);

    const handleToggleDescription = (nome) => {
        setOpenedCard(openedCard === nome ? null : nome);
    }

    const options = {
        keys: ['nome', 'assunto', 'descricao'],
        threshold: 0.3
    };
    const fuse = new Fuse(resumos, options);
    const results = search ? fuse.search(search).map(result => result.item) : resumos;

    return (
        <UserAuthProvider>
          <div>
          <HeaderUsuario search={search} setSearch={setSearch} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />            <div> 
                <h1>Resumos</h1>
                <div style={{display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"space-evenly"}}>
                    {results.length === 0 ? 
                        <div>Nenhum Resumo encontrado com esses termos...</div> : 
                        results.map(resumo => (
                            <CardResumo 
                                key={resumo.id} 
                                resumo={resumo}
                                isDescriptionOpen={openedCard === resumo.nome} 
                                onToggleDescription={() => handleToggleDescription(resumo.nome)} 
                            />
                        ))
                    }
                </div>
            </div>
            <br />
            <Footer/>
          </div>
        </UserAuthProvider>
    )
}
