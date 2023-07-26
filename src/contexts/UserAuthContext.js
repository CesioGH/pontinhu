import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase'; 

export const UserAuthContext = createContext();

export const useUserAuth = () => {
  return useContext(UserAuthContext);
};

export const UserAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const value = {
    currentUser,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {!loading && children}
    </UserAuthContext.Provider>
  );
};
