import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { useUserAuth } from '../src/contexts/UserAuthContext';
import HeaderUsuario from "/src/components/HeaderUsuario";
import { UserAuthProvider } from '../src/contexts/UserAuthContext';
import { useRouter } from 'next/router';
import { Card, Popover, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import Fuse from 'fuse.js';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const MeusResumos = (props) => {
    const { currentUser } = useUserAuth();
    const [boughtResumes, setBoughtResumes] = useState([]);
    const [pdfSrc, setPdfSrc] = useState(null);
    const [activeResume, setActiveResume] = useState(null);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [showPDF, setShowPDF] = useState(false);
    const { darkMode, setDarkMode } = useUserAuth();

    useEffect(() => {
        document.body.style.backgroundColor = darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default;
    }, [darkMode]);

    const toggleDarkMode = () => {
      setDarkMode(prevMode => !prevMode);
    };

    const open = Boolean(anchorEl);

    const handleClick = (event, resumo) => {
        if (activeResume === resumo) {
            setActiveResume(null);
            setAnchorEl(null);
        } else {
            setActiveResume(resumo);
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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

    const options = {
        keys: ['nome', 'assunto', 'descricao'],
        threshold: 0.3
    };
    const fuse = new Fuse(boughtResumes, options);
    const filteredResumes = searchTerm ? fuse.search(searchTerm).map(result => result.item) : boughtResumes;

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <UserAuthProvider>
            <Box>
            <HeaderUsuario 
                search={searchTerm} 
                setSearch={setSearchTerm} 
                toggleDarkMode={toggleDarkMode} 
                darkMode={darkMode}
                dataList={boughtResumes}
            />

              <Typography style={{color: darkMode ? "#f5f5f5" : "#000"}} variant="h3" align="center" gutterBottom>
                  Meus Resumos
              </Typography>
              {showPDF ? (
                  <>
                  <Button size="large" onClick={() => setShowPDF(false)}>
                          Ver meus outros resumos
                      </Button>
                      <Box width="100%" height="100vh">
                          <iframe src={pdfSrc} width="100%" height="100%" style={{ border: 'none' }}></iframe>
                      </Box>
                      <Button size="large" onClick={() => setShowPDF(false)}>
                          Ver meus outros resumos
                      </Button>
                  </>
              ) : (
                  <>
                      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
                          {filteredResumes.length === 0 ? (
                              <Typography style={{color:"GrayText"}}>Você não possui nenhum Resumo sobre isso...</Typography>
                          ) : (
                              filteredResumes.map((resumo, index) => (
                                  <div key={index}>
                                      <Card sx={{ maxWidth: 345, m: 1, boxShadow: 3, '&:hover': { transform: 'scale(1.02)' } }}>
                                           <CardMedia
                                        component="img"
                                        height="140"
                                        image={resumo.thumbnail}
                                        alt="thumbnail"
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {resumo.nome}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {resumo.assunto}
                                        </Typography>
                                        <Button size="small" onClick={(event) => handleClick(event, resumo)}>
                                            Descrição
                                        </Button>
                                        <Button size="small" onClick={() => {
                                            setPdfSrc(resumo.pdf);
                                            setActiveResume(resumo);
                                            setShowPDF(true);
                                        }}>
                                            Ver PDF
                                        </Button>

                                    </CardContent>
                                    </Card>
                                </div>
                            ))
                        )}
                    </Box>
                    <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <Typography style={{ padding: '10px', backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? '#f5f5f5' : 'black' }}>
              {activeResume?.descricao}
            </Typography>
          </Popover>
            </>
        )}
    </Box>
</UserAuthProvider>
</ThemeProvider>
);

}

export default MeusResumos;