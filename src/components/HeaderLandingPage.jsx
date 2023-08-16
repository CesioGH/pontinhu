import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserAuth } from '../../src/contexts/UserAuthContext';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from "../lib/firebase";
import { Avatar, Button, AppBar, Toolbar, InputBase, Box, Menu, MenuItem, Switch } from '@mui/material';
import { styled } from '@mui/system';
import Image from 'next/image';
import { useRouter } from 'next/router';

const StyledButton = styled(Button)`
    background-color: #D4AF37;
    width: 20vw;

    @media (max-width: 768px) { 
        width: 20vw;
        font-size: 0.75em;
        padding-bottom: 0;
        padding-top: 1px;
        line-height: 1.3;
    }

    @media (max-width: 321px) {
    width: 25vw;
    }
`;

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
`;

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
  },}));

const HeaderLandingPage = ({ toggleDarkMode, darkMode }) => {
    const { currentUser } = useUserAuth();
    const googleProvider = new GoogleAuthProvider();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const router = useRouter();

  useEffect(() => {
    const h2Element = document.querySelector('h2');

    const h2Color = h2Element ? window.getComputedStyle(h2Element).color : null;

    const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;

    if (h2Color === 'rgba(0, 0, 0, 0.87)' && bodyBackgroundColor === 'rgb(51, 51, 51)') {
      location.reload();
    } else if (h2Color === 'rgb(255, 255, 255)' && bodyBackgroundColor === 'rgb(245, 245, 245)') {
      location.reload();
    }
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

    return (
      <AppBar position="static">
          <Toolbar>
          <StyledLink href="/" passHref>
          <Image
                src="/img/logo1-removebg-preview.png"
                width={270}
                height={150}
                alt="Pontinhos"
            />
         </StyledLink>
              
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                 
              <>
            <style jsx>{`
                a {
                    text-decoration: none !important;
                    color: inherit;
                }

                a:visited {
                    color: inherit;
                }
            `}</style>
            <Link href="/Geral" passHref>
                <StyledButton color="primary" variant="contained">
                     COMPRAR RESUMOS
                </StyledButton>
            </Link>
           </>

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
};

export default HeaderLandingPage;
