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
import Slider from '@mui/material/Slider';
import styles from '../../styles/Card.module.css'
import Image from 'next/image';

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
    const [cardSize, setCardSize] = useState(90); 

    
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


        const cardMinWidth = 200 * (cardSize / 100);


        return (
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
             <div>
                 <HeaderUsuario 
                    search={search} 
                    setSearch={setSearch} 
                    darkMode={darkMode} 
                    toggleDarkMode={toggleDarkMode} 
                    dataList={resumos}
                 />
                 <div style={{paddingTop:"50px"}} > 
                     <div>
                        <h1 style={{color:"GrayText", marginLeft:"10px", color: "#D4AF37"}}>Compre seus Resumos com toda segurança do Mercado Pago </h1>
                        <h2 style={{color:"GrayText", marginLeft:"10px"}}></h2>
                        
                            <label style={{color:"GrayText",marginRight:"10vw",marginLeft:"40vw"}}>Ajuste o tamanho do Card</label>
                            <Slider
                                value={cardSize}
                                onChange={(event, newValue) => setCardSize(newValue)}
                                aria-labelledby="card-size-slider"
                                valueLabelDisplay="auto"
                                step={10}
                                marks
                                min={50} // Mínimo de 50% do tamanho original
                                max={150} // Máximo de 150% do tamanho original
                            />
                     </div>

                     
                     <div className={styles.cardContainer} style={{ '--card-min-width': `${cardMinWidth}px` }}>
                        {results.length === 0 ? 
                            <div style={{color:"GrayText"}}>Nenhum Resumo encontrado com esses termos...</div> : 
                            results.map(resumo => (
                            <CardResumo 
                                key={resumo.id} 
                                resumo={resumo}
                                isDescriptionOpen={openedCard === resumo.nome} 
                                onToggleDescription={() => handleToggleDescription(resumo.nome)} 
                                darkMode={darkMode}
                                cardSize={cardSize}
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