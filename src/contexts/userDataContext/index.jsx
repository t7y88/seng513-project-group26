// UserDataContext.jsx
//
// This file defines a React context for storing and accessing authenticated
// user data and their completed hikes. It centralizes data loading logic and
// provides a shared state across the app so that multiple components can access
// the current user's profile and hike history without making duplicate API calls.

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authContext";
import {
  getCompletedHikes,
  getFriends,
} from "../../firebase/";
import { getUserHikeWishlist } from "../../firebase/firestoreUser";
import { db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Default shape for fallback and dev tools
const defaultContextValue = {
  userData: null,
  completedHikes: [],
  hikeWishlist: [],
  friends: [],
  loading: true,
};

// Create the context object that will be shared across the app
export const UserDataContext = createContext(defaultContextValue);

/**
 * Custom hook to access the UserDataContext.
 * Throws an error if called outside of the UserDataProvider.
 */
export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}

// Could refactor into smaller custom hooks (e.g., useWishlist), but that will require
// use altering lots of other pages, so I'm gonna backburner that.


/**
 * Context provider component that fetches and provides user data to its children.
 *
 * This component:
 * - Waits for authentication state to become available via useAuth()
 * - Uses Firestore `onSnapshot()` to listen for live changes to the user's document
 * - Fetches all completed hikes associated with that UID
 * - Fetches the hike wishlist (list of hike docIds)
 * - Fetches the friend list (UIDs of accepted friendships)
 * - Stores and shares this data with any nested components via the context
 *
 * It must wrap any components that want to access userData via useUserData().
 */
export const UserDataProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();

  const [userData, setUserData] = useState(null);             // User profile document
  const [completedHikes, setCompletedHikes] = useState([]);   // List of completed hikes
  const [hikeWishlist, setHikeWishlist] = useState([]);       // List of wishlisted hikes (full HikeEntity docs)
  const [friends, setFriends] = useState([]);                 // List of friends (by Firestore document UID)
  const [loading, setLoading] = useState(true);               // Loading state for all data sources

  useEffect(() => {
    // Don't proceed until authentication is finished and we have a logged-in user
    if (authLoading || !currentUser) return;

    // Reference to the user document in Firestore
    const userRef = doc(db, "users", currentUser.uid);

    // Attach a real-time listener to the user document
    const unsubscribe = onSnapshot(userRef, async (userSnapshot) => {
      if (!userSnapshot.exists()) {
        console.error("User document does not exist");
        return;
      }

      // Merge Firestore doc data with its ID
      const user = { id: userSnapshot.id, ...userSnapshot.data() };

      try {
        // Fetch related data (but not stored inside user doc)
        const [hikes, wishlist, friendsList] = await Promise.all([
          getCompletedHikes(currentUser.uid),
          getUserHikeWishlist(currentUser.uid),
          getFriends(currentUser.uid),
        ]);

        // Logging for dev/debug purposes
        console.log("Realtime fetched user:", user);
        console.log("Fetched hikes:", hikes);
        console.log("Fetched wishlisted hikes:", wishlist);
        console.log("Fetched friends:", friendsList);

        // Update state
        setUserData(user);
        setCompletedHikes(hikes);
        setHikeWishlist(wishlist);
        setFriends(friendsList);
      } catch (err) {
        console.error("Failed to fetch related user data", err);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup the listener when the user changes or component unmounts
    return () => unsubscribe();
  }, [currentUser, authLoading]);

  // Context provider wraps all children in the app
  return (
    <UserDataContext.Provider
      value={{ userData, completedHikes, hikeWishlist, friends, loading }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
