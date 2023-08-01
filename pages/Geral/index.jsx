import CardResumo from "../../src/components/CardResumo"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '../../src/lib/firebase';
import HeaderUsuario from "../../src/components/HeaderUsuario"
import { UserAuthProvider } from '../../src/contexts/UserAuthContext';
import Footer from "../../src/components/Footer";

export default function Geral(){
    
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

    return(
        <UserAuthProvider>
            <div>
                <HeaderUsuario/>
                <input
                    type="text"
                    placeholder="Pesquisar resumos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div style={{display:"flex",flexDirection:"column",alignItems:"center", marginBottom:"15px"}}> 
                    <h1>Resumos</h1>
                    <div style={{display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"space-evenly"}}>
                        {resumos
                            .filter(resumo =>
                            resumo.nome.toLowerCase().includes(search.toLowerCase()) ||
                            resumo.assunto.toLowerCase().includes(search.toLowerCase()) ||
                            resumo.descricao.toLowerCase().includes(search.toLowerCase())
                            )
                            .map(resumo => (
                            <CardResumo 
                                key={resumo.id} 
                                resumo={resumo}
                                isDescriptionOpen={openedCard === resumo.nome} 
                                onToggleDescription={() => handleToggleDescription(resumo.nome)} 
                            />
                        ))}
                    </div>
                </div>
                <br />
                <Footer/>
            </div>
        </UserAuthProvider>
    )
}
