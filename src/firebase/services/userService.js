// @ts-check
/// <reference path="../../types/firestoreModels.js" />

import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

/**
 * Creates or overwrites a user document in the `users` collection using a predefined UID.
 *
 * This is typically called after Firebase Authentication creates the user,
 * so the UID from Firebase Auth is used as the Firestore document ID.
 *
 * Throws:
 * - Error if required fields in the `userData` object are missing
 * - Error if the Firestore operation fails
 *
 * Notes:
 * - This function **overwrites** any existing document with the same UID.
 * - Validation ensures required fields are present before attempting write.
 *
 * @param {string} uid - The UID to use as the document ID (from Firebase Auth).
 * @param {UserProfile} userData - The full user profile data to store in Firestore.
 * @throws {Error} If required fields are missing or if Firestore fails to write the document.
 * @returns {Promise<void>}
 * @author aidan
 */
export const createUserInFirestore = async (uid, userData) => {
  if (!uid || typeof uid !== "string") {
    throw new Error("Invalid or missing UID.");
  }

  const requiredFields = [
    "email",
    "username",
    "name",
    "age",
    "location",
    "friends",
    "memberSince",
    "admin",
  ];
  for (const field of requiredFields) {
    if (userData[field] === undefined || userData[field] === null) {
      throw new Error(`Missing required user field: ${field}`);
    }
  }

  const userRef = doc(db, "users", uid);

  try {
    await setDoc(userRef, userData);
    console.log(
      `User document for UID ${uid} created or updated successfully.`
    );
  } catch (error) {
    console.error("Failed to create user in Firestore:", error);
    throw new Error("Failed to create user. Please try again.");
  }
};

/**
 * Updates the 'admin' field of a user document in Firestore.
 *
 * This function checks whether the user document exists before attempting to update it.
 * If the user is found, the 'admin' field is updated to the provided boolean value.
 * If the user does not exist, an error is logged and no changes are made.
 *
 * @param {string} uid - The UID of the user whose admin status is being updated.
 * @param {boolean} isAdmin - A boolean value indicating whether the user should be marked as an admin (true) or not (false).
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const setUserAdminStatus = async (uid, isAdmin) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    console.error(`User with UID ${uid} not found.`);
    return;
  }

  try {
    await updateDoc(userRef, {
      admin: isAdmin,
    });
    console.log(`Updated admin status for UID ${uid} to ${isAdmin}`);
  } catch (err) {
    console.error("Failed to update admin status:", err);
  }
};

/**
 * Creates a user document if it doesn't exist, or returns existing user data.
 * This is useful after authentication to ensure the user has a profile.
 *
 * @param {string} uid - The Firebase Authentication UID
 * @param {Object} [authData] - Optional auth provider data (e.g., from Google signin)
 * @returns {Promise<UserProfile>} The user profile data
 */
export const ensureUserExists = async (uid, authData = {}) => {
  try {
    // Try to get existing user data
    const existingUser = await getUserFromFirestore(uid);

    // If user exists, return their data
    if (existingUser) {
      return /** @type {UserProfile} */ (existingUser);
    }

    // User doesn't exist, create default profile
    const defaultUserData = {
      email: authData.email || "",
      username: authData.displayName || "user" + uid.substring(0, 5),
      name: authData.displayName || "",
      age: 0,
      location: "",
      friends: [],
      admin: false,
      memberSince: new Date().toLocaleDateString(),
      about: "",
      description: "",
      profileImage: authData.photoURL || "",
    };

    // Create the user document
    await createUserInFirestore(uid, defaultUserData);
    return defaultUserData;
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    throw error;
  }
};

/**
 * Check if a username is already taken by another user
 * @param {string} username - The username to check
 * @returns {Promise<boolean>} - True if the username is available, false if taken
 */
export const isUsernameAvailable = async (username) => {
  if (!username || username.trim() === "") return false;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username.trim()));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // Return true if no documents found (username available)
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false; // Return false to be safe in case of errors
  }
};

/** 1.1
 * Creates a new user document in the `users` collection using an automatically generated ID.
 *
 * This is unlikely to be needed, but just in case.
 *
 * This is used for when the document does not need to be tied to a authentication UID.
 *
 * @param {UserProfile} userData - The user profile data to store in Firestore.
 * @returns {Promise<string>} The auto-generated document ID of the newly created user.
 */
export const addUserToFirestore = async (userData) => {
  const usersRef = collection(db, "users");
  const docRef = await addDoc(usersRef, userData);
  return docRef.id;
};

// 2. Get user data
/**
 * Retrieves a user's profile data from Firestore.
 *
 * @param {string} userId - The ID of the user to retrieve
 * @returns {Promise<UserProfile|null>} The user profile or null if not found
 */
export const getUserFromFirestore = async (userId) => {
  try {
    // console.log(`Attempting to fetch user with ID: ${userId}`);
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      console.log("User document found:", data);

      return /** @type {UserProfile} */ ({
        ...data,
        id: userSnap.id, // this overrides any accidental id field
      });
    } else {
      console.log(`No user found with ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("Error getting user from Firestore:", error);
    throw error;
  }
};

// 3. Get all users
export const getAllUsers = async () => {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(
    (doc) => /** @type {UserProfile} */ ({ id: doc.id, ...doc.data() })
  );
};

// 4. Update user
export const updateUser = async (uid, updates) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
};

// 5. Delete user
export const deleteUser = async (uid) => {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
};

// 6. Update a user's completed hikes
export const updateCompletedHikes = async (uid, completedHikes) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { completedHikes }, { merge: true });
};

// 7. Update a user's wishlisted hikes
export const updateWishlistedHikes = async (uid, wishlistedHikes) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { wishlistedHikes }, { merge: true });
};
