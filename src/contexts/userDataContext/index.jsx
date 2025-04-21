// UserDataContext.jsx
//
// This file defines a React context for storing and accessing authenticated
// user data and their completed hikes. It centralizes data loading logic and
// provides a shared state across the app so that multiple components can access
// the current user's profile and hike history without making duplicate API calls.

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authContext";
import { getUserFromFirestore, getCompletedHikes } from "../../firebase/firestore";
import { getFriends } from "../../firebase/firestore";


// This is the default shape of the context.
// It is used to initialize the context and acts as a fallback if the context is
// accessed outside of the provider (not recommended).
const defaultContextValue = {
  userData: null,
  completedHikes: [],
  friends: [],
  loading: true,
};

// Create the context object that will store and provide user data.
// This will be consumed using useContext in child components.
const UserDataContext = createContext(defaultContextValue);

/**
 * Custom React hook to access the user data context.
 * 
 * This provides components with access to:
 * - userData: the user profile document from Firestore
 * - completedHikes: an array of hike records completed by the user
 * - loading: a boolean indicating whether the data is still being fetched
 * 
 * This hook throws an error if used outside of <UserDataProvider>, to prevent
 * unintentional usage before the context is ready.
 */
export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};

/**
 * Context provider component that fetches and provides user data to its children.
 * 
 * This component:
 * - Waits for authentication state to become available via useAuth()
 * - Fetches the user’s Firestore document using their UID
 * - Fetches all completed hikes associated with that UID
 * - Stores and shares this data with any nested components via the context
 * 
 * It must wrap any components that want to access userData via useUserData().
 */
export const UserDataProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();

  const [userData, setUserData] = useState(null);             // User profile document
  const [completedHikes, setCompletedHikes] = useState([]);   // List of completed hikes
  const [friends, setFriends] = useState([]);                 // List of friends (by Firestore document UID)
  const [loading, setLoading] = useState(true);               // Loading state for both fetches

  useEffect(() => {
    // Only run the fetch once the auth state is resolved and a user is present
    if (authLoading || !currentUser) return;

    const fetchData = async () => {
      try {
        // Retrieve user profile and hike data from Firestore
        const user = await getUserFromFirestore(currentUser.uid);
        const hikes = await getCompletedHikes(currentUser.uid);
        const friends = await getFriends(currentUser.uid);

        console.log("Fetched user:", user);
        console.log("Fetched hikes:", hikes);
        console.log("Fetched friends:", friends);

        setUserData(user);
        setCompletedHikes(hikes);
        setFriends(friends);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, authLoading]);

  // Provide the fetched data and loading state to any child components
  return (
    <UserDataContext.Provider value={{ userData, completedHikes, friends, loading }}>
      {children}
    </UserDataContext.Provider>
  );
};
