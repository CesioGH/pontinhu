import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserAuth } from '../../src/contexts/UserAuthContext';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from "../../src/lib/firebase";
import { nfd } from 'unorm';
import { Avatar, Button, AppBar, Toolbar, InputBase, Box, Menu, MenuItem, Switch } from '@mui/material';
import { styled, width } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import Fuse from 'fuse.js';
import { Tooltip } from '@mui/material';

const fuseOptions = {
    includeScore: true, 
    keys: ['nome', 'assunto', 'descricao']
};

const StyledLink = styled(Link)`
    img {
        width: 200px;
        height: auto;
    }

    @media (max-width: 768px) {
        img {
            width: 150px;
            height: auto;
        }
    }
   
    @media (max-width: 468px) {
        img {
            width: 100px;
            height: auto;
        }
    }
`;

const sanitizeString = (str) => {
    return nfd(str).replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
  '@media (max-width: 425px)': {
    marginRight: 0,
},
}));

const HeaderUsuario = ({ props, search, setSearch, toggleDarkMode, darkMode, dataList }) => {
    const { currentUser } = useUserAuth();
    const googleProvider = new GoogleAuthProvider();
    const router = useRouter();
    const [tooltipOpen, setTooltipOpen] = useState(true);


    const [suggestions, setSuggestions] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleSearchChange = (e) => {
        const value = sanitizeString(e.target.value);
        setSearch(value);

        if (value.length > 0) {
            const fuse = new Fuse(dataList, fuseOptions);
            const result = fuse.search(value);
            setSuggestions(result.map(item => item.item.nome || item.item.assunto || item.item.descricao));
        } else {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest('#sugestao')) {
                setSuggestions([]);
            }
        };
        window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, []);

    const handleSignIn = async () => {
        router.push("/loginPage")
    };

    const handleSignOut = async () => {
        if (window.confirm("Você realmente quer deslogar?")) {
            try {
                await signOut(auth);
                console.log("Logout successful");
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getPlaceholderText = () => {
        switch (router.pathname) {
            case '/Geral':
                return 'Pesquisar ...';
            case '/meusResumos':
                return 'Pesquisar ...';
            default:
                return '';
        }
    };

    useEffect(() => {
      console.log(dataList);
    }, [dataList]);

    return (
        <AppBar style={{
            position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000
        }}>
            <Toolbar>
                <StyledLink href="/" passHref>
                    <Image
                        src="/img/logo1-removebg-preview.png"
                        width={270}
                         height={150}
                        alt="Pontinhos"
                    />
                </StyledLink>
                <Box sx={{ position: 'relative', ml: 1, width: { xs: '60%', md: '30%' } }}>
                    <SearchIcon 
                        sx={{ 
                            position: 'absolute', 
                            left: 0.5,   // Reduzir o espaçamento à esquerda
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            width: {
                                xs: '15px',   
                                sm: '20px',   
                                md: '25px',   
                            },
                            height: {
                                xs: '15px',
                                sm: '20px',
                                md: '25px',
                            }
                        }}
                    />
                    <Tooltip title="Pesquise aqui o resumo que procura" open={tooltipOpen} arrow>
                    <InputBase
                        id='sugestao'
                        onClick={() => setTooltipOpen(false)}
                        placeholder={getPlaceholderText()}
                        value={sanitizeString(search)}
                        onChange={handleSearchChange}
                        sx={{ 
                            pl: 2.5, 
                            pr: 5, 
                            color: 'inherit', 
                            width: '100%',
                            fontSize: {
                                xs: '0.8rem',   // Menor fonte para telas extra pequenas
                                sm: '0.9rem',   // Tamanho de fonte ligeiramente maior para telas pequenas
                                md: '1rem',     // Fonte padrão para telas médias e superiores
                            },
                            '& svg': {         // Isso vai selecionar o ícone dentro do InputBase
                                width: {
                                    xs: '15px',   // Tamanho do ícone para telas extra pequenas
                                    sm: '20px',   // Tamanho do ícone para telas pequenas
                                    md: '25px',   // Tamanho padrão do ícone para telas médias e superiores
                                },
                                height: {
                                    xs: '15px',
                                    sm: '20px',
                                    md: '25px',
                                }
                            } 
                        }}
                    />
                    
                    </Tooltip>

                    {suggestions.length > 0 && (
                        <Box 
                            sx={{ 
                                position: 'absolute', 
                                top: '100%', 
                                left: 0, 
                                right: 0, 
                                maxHeight: '200px', 
                                overflowY: 'scroll', 
                                bgcolor: 'white', 
                                color: 'black',   
                                zIndex: 10, 
                                boxShadow: 3 ,                                     
                            }
                            }
                            >
                            {suggestions.map((suggestion, index) => (
                                <Box 
                                    key={index} 
                                    sx={{ 
                                        padding: 1, 
                                        cursor: 'pointer' 
                                    }} 
                                    onClick={() => {
                                        setSearch(suggestion);
                                        setSuggestions([]);
                                    }}
                                >
                                    {suggestion}
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
                <Box sx={{ 
                    ml: 'auto', 
                    display: 'flex', 
                    alignItems: 'center',
                    '@media (max-width: 374px)': {
                        flexDirection: 'column',  
                        '& > :first-child': {  
                            marginBottom: 1, 
                        },
                    }
                }}>
    
                    <MaterialUISwitch checked={darkMode} onChange={toggleDarkMode} />
                    {currentUser ? (
                        <>
                            <Avatar
                                alt="Foto do usuário"
                                src={currentUser.photoURL}
                                sx={{ cursor: 'pointer', ml: 2 }}
                                onClick={handleMenu}
                            />
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem disabled>
                                    {currentUser.email}
                                </MenuItem>
                                <MenuItem style={{display:"flex", flexDirection:"column"}} onClick={handleClose}>
                                  <Button>
                                    <Link style={{color: "#D4AF37"}} href="/meusResumos">Meus Resumos</Link>
                                   </Button>
                                    
                                  <Button>
                                    <Link style={{color:"grey"}} href="/sendMessage">dúvidas/sugestões</Link>
                                  </Button>

                                </MenuItem>
                                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button color="inherit" onClick={handleSignIn}>Log in</Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default HeaderUsuario;
