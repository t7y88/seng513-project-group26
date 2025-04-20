import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import React, { useContext, useEffect, useState } from "react";
import { defaultAuthContext } from "../../types/types";
import { ensureUserExists } from "../../firebase/firestore";

const AuthContext = React.createContext(defaultAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      // Create user profile if it doesn't exist
      try {
        // Extract basic auth data to populate the user profile
        const authData = {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        
        // This will create the user document if it doesn't exist
        await ensureUserExists(user.uid, authData);
      } catch (error) {
        console.error("Error initializing user:", error);
      }
      
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  const value = {
    currentUser,
    userLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}