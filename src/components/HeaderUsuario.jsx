import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserAuth } from '../../src/contexts/UserAuthContext';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from "../lib/firebase";
import styled from 'styled-components';

const LogoImage = styled.img`
  width: 70px;

  @media (max-width: 600px) {
    width: 50px;
  }
`;

const SearchInput = styled.input`
  // estilize sua input de acordo com sua necessidade
  margin-left: 20px;
  height: 20px;
  padding: 2px;
`;

const UserButton = styled.button`
  max-width: 200px;
  white-space: wrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 600px) {
    max-width: 100px;
    font-size: 0.8em;
  }
  @media (max-width: 425px) {
    max-width: 80px;
    font-size: 0.7em;
  }
  @media (max-width: 320px) {
    max-width: 75px;
    font-size: 0.65em;
  }
`;

const UserImage = styled.img`
  cursor: pointer;
  width: 60px;
  border-radius: 20%;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.3);
  }

  @media (max-width: 600px) {
    width: 40px;
  }
`;

const HeaderContainer = styled.header`
  position: fixed; 
  top: 0; 
  width: 99%; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  
  z-index: 100; // Adicione esta linha para garantir que o header esteja acima dos outros elementos da página.

  @media (max-width: 600px) {
    padding: 2px;
  }

  @media (max-width: 600px) {
    padding: 2px;
  }
`;

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
    <HeaderContainer>
      <Link href="/Geral">
        <LogoImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Some_trees.jpg/303px-Some_trees.jpg" alt="Logo do Aplicativo" />
      </Link>
      <SearchInput
        type="text"
        placeholder={getPlaceholderText()}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {currentUser ? (
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems:"center", gap:"5px" }}>
            <Link href="/meusResumos">
              <UserButton>Meus Resumos</UserButton>
            </Link>
            <div  style={{ display:"flex", flexDirection:"column",gap:"1px",alignItems:"center", paddingTop:"15px"  }}>
              <UserImage onClick={toggleDropdown} src={currentUser.photoURL} alt="Foto do usuário" />
              <p style={{color:"white"}}>{currentUser.displayName}</p>
            </div>   
          </div>
          {dropdownOpen && (
            <div style={{ position: 'absolute', right: "10%", top: '70%', backgroundColor: 'white', padding: '5px', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', borderRadius:"10px" }}>
              <div style={{display:"flex", padding: '10px',flexDirection:"column", alignItems:"center", gap:"1px"}}>
                <p>{currentUser.email}</p>
                <Link href="/meusResumos">Meus Resumos</Link>
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"5px"}}>
                <button onClick={handleSignOut}>Logout</button>
                <button onClick={handleSwitchUser}>Trocar de Usuário</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button onClick={handleSignIn}>Login com Google</button>
      )}
    </HeaderContainer>
  );
};

export default HeaderUsuario;
