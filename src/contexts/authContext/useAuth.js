import React, { useState, useEffect, useContext } from "react";
import { defaultAuthContext } from "../../types/types";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const AuthContext = React.createContext(defaultAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserLoggedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
