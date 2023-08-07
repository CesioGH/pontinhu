import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserAuth } from '../../src/contexts/UserAuthContext';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from "../lib/firebase";
import { nfd } from 'unorm';
import { Avatar, Button, AppBar, Toolbar, InputBase, Box, Typography, Menu, MenuItem } from '@mui/material';
import { alpha } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import Fuse from 'fuse.js';

const fuseOptions = {
  includeScore: true,
  keys: ['nome', 'assunto', 'descricao']
};


const sanitizeString = (str) => {
  return nfd(str).replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const HeaderUsuario = ({ search, setSearch, toggleDarkMode , darkMode}) => {
  const { currentUser } = useUserAuth();
  const googleProvider = new GoogleAuthProvider();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error(redirectError);
        }
      }
    }
  };

  const handleSwitchUser = async () => {
    await handleSignOut();
    const switchProvider = new GoogleAuthProvider();
    switchProvider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, switchProvider);
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, switchProvider);
        } catch (redirectError) {
          console.error(redirectError);
        }
      }
    }
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
        return '  Pesquisar resumos...';
      case '/meusResumos':
        return '  Pesquisar meus resumos...';
      default:
        return '';
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" passHref>
          <Typography variant="h6" component="a" sx={{ flexGrow: 1, cursor: 'pointer' }}>
            Logo do Aplicativo
          </Typography>
        </Link>
        <Box sx={{ position: 'relative', ml: 1, width: { xs: '50%', md: '30%' } }}>
          <SearchIcon sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', ml: 0.5, pointerEvents: 'none' }} />
          <InputBase
            placeholder={getPlaceholderText()}
            value={sanitizeString(search)}
            onChange={(e) => setSearch(sanitizeString(e.target.value))}
            sx={{ pl: 2, color: 'inherit', width: '100%' }}
          />
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          <Switch checked={darkMode} onChange={toggleDarkMode} />
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
                <MenuItem onClick={handleClose}>
                  <Link href="/meusResumos">Meus Resumos</Link>
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                <MenuItem onClick={handleSwitchUser}>Trocar de Usuário</MenuItem>
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