import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserAuth } from '../../src/contexts/UserAuthContext'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from "../lib/firebase";

const HeaderUsuario = () => {
  const { currentUser } = useUserAuth(); 
  console.log("Current User:", currentUser); 
  
  const googleProvider = new GoogleAuthProvider();
  
  
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
          
          
        </div>
      ) : (
        <button onClick={handleSignIn}>Login com Google</button>
      )}
    </header>
  );
};

export default HeaderUsuario;
