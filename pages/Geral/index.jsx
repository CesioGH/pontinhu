import CardResumo from "../../src/components/CardResumo";
import Link from 'next/link';
import { useEffect, useState } from 'react'; 
import { db } from '../../src/lib/firebase';
import HeaderUsuario from "../../src/components/HeaderUsuario";
import { UserAuthProvider, useUserAuth } from '../../src/contexts/UserAuthContext';
import Footer from "../../src/components/Footer";
import Fuse from 'fuse.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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



export default function Geral(){
    
    const [resumos, setResumos] = useState([]);
    const [openedCard, setOpenedCard] = useState(null); 
    const [search, setSearch] = useState("");
    const { darkMode, setDarkMode, toggleDarkMode } = useUserAuth();

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

        useEffect(() => {
            document.body.style.backgroundColor = darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default;
        }, [darkMode]);


        return (
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
             <div>
                 <HeaderUsuario search={search} setSearch={setSearch} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                 <div> 
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
                                     darkMode={darkMode}
                                 />
                             ))
                         }
                     </div>
                 </div>
                 <br />
                 <Footer/>
             </div>
       </ThemeProvider>
       )
}