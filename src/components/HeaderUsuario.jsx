import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserAuth } from '../../src/contexts/UserAuthContext';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from "../lib/firebase";
import styles from '../../styles/HeaderUsuario.module.css';
import { nfd } from 'unorm';

const sanitizeString = (str) => {
  return nfd(str).replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const HeaderUsuario = ({search, setSearch }) => {
  const { currentUser } = useUserAuth();
  const googleProvider = new GoogleAuthProvider();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  

  const getPlaceholderText = () => {
    switch (router.pathname) {
      case '/Geral':
        return 'Pesquisar resumos...';
      case '/meusResumos':
        return 'Pesquisar meus resumos...';
      default:
        return '';
    }
  };

  return (
    <header className={styles.headerContainer}>
      <Link href="/Geral">
        <img className={styles.logoImage} src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Some_trees.jpg/303px-Some_trees.jpg" alt="Logo do Aplicativo" />
      </Link>
      <input className={styles.searchInput} type="text" placeholder={getPlaceholderText()} value={sanitizeString(search)} onChange={(e) => setSearch(sanitizeString(e.target.value))} />
      {currentUser ? (
        <div className={styles.userContainer}>
          <div className={styles.userFlexContainer}>
            <Link href="/meusResumos">
              <button className={styles.userButton}>Meus Resumos</button>
            </Link>
            <div className={styles.userImageContainer}>
              <img className={styles.userImage} onClick={toggleDropdown} src={currentUser.photoURL} alt="Foto do usuário" />
              <p className={styles.userName}>{currentUser.displayName}</p>
            </div>   
          </div>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownContent}>
                <p>{currentUser.email}</p>
                <Link href="/meusResumos">Meus Resumos</Link>
              </div>
              <div className={styles.dropdownButtons}>
                <button onClick={handleSignOut}>Logout</button>
                <button onClick={handleSwitchUser}>Trocar de Usuário</button>
              </div>
            </div>
          )}
        </div>
        ) : (
          <button className={styles.loginButton} onClick={handleSignIn}>Login com Google</button>
        )}
    </header>
  );
};
  
export default HeaderUsuario;