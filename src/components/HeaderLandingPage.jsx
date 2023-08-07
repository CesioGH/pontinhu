import React, { useState } from 'react';
import Link from 'next/link';
import { useUserAuth } from '../../src/contexts/UserAuthContext';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from "../lib/firebase";
import { Avatar, Button, AppBar, Toolbar, Box, Typography, Menu, MenuItem } from '@mui/material';
import Switch from '@mui/material/Switch';

const HeaderLandingPage = ({ toggleDarkMode, darkMode }) => {
  const { currentUser } = useUserAuth();
  const googleProvider = new GoogleAuthProvider();

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
        <Link href="/" passHref>
          <Typography variant="h6" component="a" sx={{ flexGrow: 1, cursor: 'pointer' }}>
            Logo do Aplicativo
          </Typography>
        </Link>
        
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