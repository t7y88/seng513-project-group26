// @ts-check
/// <reference path="../types/firestoreModels.js" />


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
  where,
  limit,
  orderBy
} from "firebase/firestore";


// ---------- USERS ----------


/** 1.
 * Creates or overwrites a user document in the `users` collection using a predefined UID.
 *
 * Useful when syncing with Firebase Authentication UIDs.
 *
 * @param {string} uid - The UID to use as the document ID.
 * @param {UserProfile} userData - The user profile data to store.
 * @returns {Promise<void>} A promise that resolves when the document has been written.
 */
export const createUserInFirestore = async (uid, userData) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, userData);
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


/**
 * Adds or updates a hike in Firestore using the provided `hike.id` attribute as the document ID.
 *
 * @param {HikeEntity} hike - The hike data to add.
 * @returns {Promise<void>}
 */
export const createHike = async (hike) => {
  try {
    if (!hike?.id) {
      throw new Error("Missing hike.id field — cannot create hike.");
    }

    const hikeRef = doc(db, "hikes", hike.id); 
    await setDoc(hikeRef, hike); // Creates or overwrites the doc with ID = hikeId
    console.log(`Successfully added hike: ${hike.id}`);

  } catch (error) {
    console.error(`Failed to add hike: ${hike?.id}:`, error);
    throw new Error("Failed to add hike. Please try again.");
  }
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
 * @author aidan
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


/**
 * Retrieves all completed hikes for a specific user.
 *
 * NOTE: This assumes a structure like /completedHikes/{docId}, with userId as a field — not as part of the path.
 * The query should likely be updated to filter by userId instead of including it in the path.
 *
 * @param {string} userId - The ID of the user whose completed hikes should be retrieved.
 * @returns {Promise<CompletedHike[]>} A promise resolving to an array of completed hike objects.
 * 
 * @author aidan
 */
export const getCompletedHikes = async (userId) => {
  const completedHikesRef = collection(db, "completedHikes");
  
  const q = query(
    completedHikesRef,
    where("userId", "==", userId),
    orderBy("dateCompleted", "desc"), // Most recent hike comes first          
  );
  
  console.log(userId);

  const snapshot = await getDocs(completedHikesRef);
  
  //Give me all the document’s fields, and also include the document’s unique ID (key) as id
  return snapshot.docs.map((doc) => /** @type {CompletedHike} */ ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Retrieves a limited number of the most recent completed hikes for a specific user.
 *
 * Results are sorted in descending order of dateCompleted (most recent hikes first).
 * This is useful for previewing a user's recent activity (e.g. in a profile card).
 *
 * @param {string} userId - The ID of the user whose recent hikes should be retrieved.
 * @param {number} numOfHikes - The number of most recent hikes to return.
 * @returns {Promise<CompletedHike[]>} A promise resolving to a list of completed hikes.
 * 
 * @author aidan
 */
export const getMostRecentCompletedHikes = async (userId, numOfHikes) => {
  const completedHikesRef = collection(db, "completedHikes");

  const q = query(
    completedHikesRef,
    where("userId", "==", userId),
    orderBy("dateCompleted", "desc"), // Most recent hike comes first
    limit(numOfHikes)           
  );

  const snapshot = await getDocs(q);
  //Give me all the document’s fields, and also include the document’s unique ID (key) as id
  return snapshot.docs.map((doc) => /** @type {CompletedHike} */ ({
    id: doc.id,
    ...doc.data()
  }));
};


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
