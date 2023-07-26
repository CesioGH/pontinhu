import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserAuth } from '../../src/contexts/UserAuthContext'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from "../lib/firebase";

const HeaderUsuario = () => {
  const { currentUser } = useUserAuth(); // alterei para pegar currentUser do contexto
  console.log("Current User:", currentUser); // log do usuário atual para depuração
  
  const googleProvider = new GoogleAuthProvider();
  
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // O usuário foi autenticado com sucesso.
    } catch (error) {
      // Houve um erro durante a autenticação
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

  const handleSignOut = async () => {
    if (window.confirm("Você realmente quer sair?")) {
      try {
        await signOut(auth);
        console.log("Logout successful");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <header>
      <Link href="/">
        <img src="/link_to_your_logo.png" alt="Logo do Aplicativo" />
      </Link>
      {currentUser ? (
        <div>
          <button onClick={handleSignOut}>Logout</button>
          <Link href="/compras">
            Histórico de Compras
          </Link>
          <Link href="/meusResumos">
            Meus Resumos
          </Link>
        </div>
      ) : (
        <button onClick={handleSignIn}>Login com Google</button>
      )}
    </header>
  );
};

export default HeaderUsuario;
