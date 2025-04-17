// @ts-check


import { db } from "./firebase";
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
  where
} from "firebase/firestore";

// ---------- USERS ----------

// 1. Create a new user
export const createUserInFirestore = async (uid, userData) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, userData);
};

// 2. Get user data
export const getUserFromFirestore = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// 3. Get all users
export const getAllUsers = async () => {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

// ---------- HIKES ----------

// 1. Add a hike
export const addHike = async (hikeData) => {
  const hikesRef = collection(db, "hikes");  // 'hikes' is the collection name in Firestore
  const hikeDoc = await addDoc(hikesRef, hikeData);
  return hikeDoc.id;
};

// 2. Get all hikes
export const getAllHikes = async () => {
  const hikesRef = collection(db, "hikes");
  const snapshot = await getDocs(hikesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 3. Update hike
export const updateHike = async (hikeId, updates) => {
  const hikeRef = doc(db, "hikes", hikeId);
  await updateDoc(hikeRef, updates);
};

// 4. Delete hike
export const deleteHike = async (hikeId) => {
  const hikeRef = doc(db, "hikes", hikeId);
  await deleteDoc(hikeRef);
};


// ---------- HIKES BY USER ----------
/**
 * Logs a completed hike to Firestore.
 *
 * Throws:
 * - Error if required fields are missing
 * - Error if Firestore fails to write the document
 *
 * Notes:
 * - Uses composite ID (userId + hikeId + date)
 *
 * @param {CompletedHike} data
 * @throws {Error} If required fields are missing or if the document (tuple) was not inserted into the Collection (database)
 * 
 * @author aidan
 */
export const createCompletedHike = async ({ userId, hikeId, rating, notes, dateCompleted }) => {

  if (!userId || !hikeId || typeof rating !== "number") {
    throw new Error("Missing required hike data (userId, hikeId, or rating)");
  }

  const date = dateCompleted || new Date().toISOString().split("T")[0];
  // The document ID aka Primary key is a combination of - userID, hikeId, and date - (aka a composite primary key)
  const docID = `${userId}_${hikeId}_${date}`;
  // We insert the completed hike data into the completedHikes collection
  const ref = doc(db, "completedHikes", docID);

  try {
    await setDoc(ref, {
      userId,
      hikeId,
      rating,
      notes,
      dateCompleted: date,
      createdAt: new Date()
    });
  }catch (error) {
    console.error("Failed to log completed hike:", error);
    throw new Error("Failed to save hike. Please try again.");
  }

};

/**
 * Removes a completed hike from the `completedHikes` collection in Firestore.
 *
 *This function constructs the document ID using the user's ID, hike ID, and date the hike was completed,
 * and attempts to delete the corresponding document from Firestore. 
 * 
 * Throws: 
 * - Error if required fields are missing 
 * - Error if Firestore encounters an error during deletion.
 *
 * @param {CompletedHike} completedHike - The completed hike object to be removed. Must include `userId`, `hikeId`, and either `dateCompleted` or `dateHikeOccured`.
 * @returns {Promise<void>} A promise that resolves if the document is successfully deleted.
 * @throws {Error} If required fields are missing or if deletion fails.
 * 
 * @autho aidan
 */
export const removeCompletedHike = async (completedHike) => {
  const {
    userId,
    hikeId,
    dateCompleted
  } = completedHike;

  if (!userId || !hikeId || !dateCompleted) {
    throw new Error("Missing required fields: userId, hikeId, or date (dateCompleted).");
  }

  const docID = `${userId}_${hikeId}_${dateCompleted}`;
  const ref = doc(db, "completedHikes", docID);

  try {
    await deleteDoc(ref);
  } catch (error) {
    console.error("Failed to delete completed hike:", error);
    throw new Error("An error occurred while trying to remove the hike from Firestore.");
  }
};


// Get all completed hikes for a specific user
//export const getCompletedHikesByUser = async ()


// ---------- FRIENDSHIPS ----------

// Add a friendship
export const addFriendship = async (user1, user2) => {
  const friendshipsRef = collection(db, "friendships");
  await addDoc(friendshipsRef, {
    user1,
    user2,
    since: new Date()
  });
};

// ---------- REVIEWS ----------

// Add a review
export const addReview = async (reviewData) => {
  const reviewsRef = collection(db, "reviews");
  return await addDoc(reviewsRef, {
    ...reviewData,
    createdAt: new Date()
  });
};

// Get all reviews for a specific hike
export const getReviewsForHike = async (hikeId) => {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, where("hikeId", "==", hikeId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
