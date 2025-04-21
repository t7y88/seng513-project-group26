// @ts-check
/// <reference path="../types/firestoreModels.js" />

import { db } from "./firebase"; // Adjust the import path as necessary
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
  orderBy,
  startAfter,
} from "firebase/firestore";

// utilites
import {
  generateHikeDocId,
  normalizeDate,
} from "../../utils/hikeCompletionUtils.js";

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
export const getUserFromFirestore = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
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

// ---------- HIKES ----------

/**
 * Adds a hike to Firestore using an auto-generated document ID.
 * The generated ID is also saved as the `id` field inside the document.
 *
 * @param {HikeEntity} hike - The hike data to store.
 * @returns {Promise<string>} The generated document ID.
 */
export const createHike = async (hike) => {
  try {
    const hikesRef = collection(db, "hikes");

    // Temporarily add the doc without an `id` so we can get one from Firestore
    const docRef = await addDoc(hikesRef, { ...hike });

    // Add the generated ID to the document itself under `id`
    await updateDoc(docRef, { id: docRef.id });

    console.log(`Successfully added hike: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Failed to add hike:", error);
    throw new Error("Failed to add hike. Please try again.");
  }
};


/**
 * Adds a hike to Firestore with an auto-generated document ID,
 * and stores that ID in the `id` field of the document itself.
 *
 * @param {HikeEntity} hikeData - The hike data to store.
 * @returns {Promise<string>} The Firestore-generated document ID.
 */
export const addHike = async (hikeData) => {
  try {
    const hikesRef = collection(db, "hikes");

    // Step 1: Add the hike (Firestore generates the ID)
    const docRef = await addDoc(hikesRef, hikeData);

    // Step 2: Update the same doc with its generated ID in the `id` field
    await setDoc(docRef, { ...hikeData, id: docRef.id }, { merge: true });

    console.log(`Added hike with Firestore ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error adding hike:", error);
    throw new Error("Failed to add hike.");
  }
};


/**
 * Retrieves all hikes from Firestore as an array.
 * 
 * Each returned hike includes its Firestore-generated `id` field along with the rest of the hike data.
 *
 * @returns {Promise<HikeEntity[]>} An array of hike objects.
 */
export const getAllHikes = async () => {
  const hikesRef = collection(db, "hikes");
  const snapshot = await getDocs(hikesRef);
  return snapshot.docs.map(
    (doc) => /** @type {HikeEntity} */ ({ id: doc.id, ...doc.data() })
  );
};

/**
 * Retrieves all hikes from Firestore and returns them as an object map,
 * using each hike's `hikeId` property as the key.
 * 
 * Useful for fast lookup of hikes by `hikeId` instead of looping through an array.
 *
 * @returns {Promise<Record<string, HikeEntity>>} A map of hikes keyed by `hikeId`.
 */
export const getAllHikesAsMap = async () => {
  const hikesRef = collection(db, "hikes");
  const snapshot = await getDocs(hikesRef);

  const hikes = {};
  snapshot.forEach((doc) => {
    const data = doc.data();
    hikes[data.hikeId] = { id: doc.id, ...data };
  });

  return hikes;
};

/**
 * Updates an existing hike document in Firestore using the provided hikeId (which matches the Firestore doc ID).
 *
 * @param {string} hikeId - The Firestore document ID of the hike to update.
 * @param {Partial<HikeEntity>} updates - The fields to update on the hike.
 * @returns {Promise<void>}
 */
export const updateHike = async (hikeId, updates) => {
  const hikeRef = doc(db, "hikes", hikeId);
  await updateDoc(hikeRef, updates);
};

/**
 * Deletes a hike from Firestore using the `hikeId` field stored inside the document.
 * 
 * Firestore document IDs are different from hikeId.
 * It will search the 'hikes' collection for a document where `hikeId` matches
 * and delete that document.
 *
 * @param {string} hikeId - The hike's unique internal ID (not the Firestore doc ID).
 * @returns {Promise<void>}
 */
export const deleteHikeByHikeId = async (hikeId) => {
  const hikesRef = collection(db, "hikes");
  const q = query(hikesRef, where("hikeId", "==", hikeId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error(`No hike found with hikeId: ${hikeId}`);
  }

  const docToDelete = snapshot.docs[0]; // assuming hikeId is unique
  await deleteDoc(doc(db, "hikes", docToDelete.id));
};

/**
 * Deletes a hike from Firestore using the explicit Firestore document ID (`docId`).
 * 
 * This is useful when the document ID was auto-generated by Firestore and does not match the hikeId.
 *
 * @param {string} docId - The Firestore document ID to delete.
 * @returns {Promise<void>}
 */
export const deleteHikeByDocId = async (docId) => {
  const hikeRef = doc(db, "hikes", docId);
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
 * Uses a composite key for the document ID: `${userId}_${hikeId}_${dateCompleted}`
 * - This composite ID is generated by the helper utility function <generateHikeId()>
 *
 * @param {CompletedHike} data
 * @throws {Error} If required fields are missing or if the document (tuple) was not inserted into the Collection (database)
 * @returns {Promise<void>}
 * @author aidan
 */
export const createCompletedHike = async ({
  id,
  userId,
  username,
  hikeId,
  rating,
  notes,
  dateCompleted,
  timeToComplete,
  timeUnit
}) => {
  // Validate required fields
  if (!userId || !username || !hikeId || typeof rating !== "number" || typeof timeToComplete !== "number" || !timeUnit) {
    throw new Error("Missing required hike data (userId, username, hikeId, rating, timeToComplete, or timeUnit)");
  }

  const date = normalizeDate(dateCompleted ?? new Date());
  // The document ID aka Primary key is a combination of - userID, hikeId, and date - (aka a composite primary key)
  const docId = generateHikeDocId(userId, hikeId, date);
  // We insert the completed hike data into the completedHikes collection
  const ref = doc(db, "completedHikes", docId);

  try {
    await setDoc(ref, {
      id,
      userId,
      username,
      hikeId,
      rating,
      notes,
      dateCompleted: date,
      timeToComplete,
      timeUnit,
      createdAt: new Date()
    });
  } catch (error) {
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
  const { userId, hikeId, dateCompleted } = completedHike;

  if (!userId || !hikeId || !dateCompleted) {
    throw new Error(
      "Missing required fields: userId, hikeId, or date (dateCompleted)."
    );
  }

  const docID = generateHikeDocId(userId, hikeId, dateCompleted);
  const ref = doc(db, "completedHikes", docID);

  try {
    await deleteDoc(ref);
  } catch (error) {
    console.error("Failed to delete completed hike:", error);
    throw new Error(
      "An error occurred while trying to remove the hike from Firestore."
    );
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
    orderBy("dateCompleted", "desc") // Most recent hike comes first
  );

  console.log(userId);

  const snapshot = await getDocs(q);

  //Give me all the document’s fields, and also include the document’s unique ID (key) as id
  return snapshot.docs.map(
    (doc) =>
      /** @type {CompletedHike} */ ({
        id: doc.id,
        ...doc.data(),
      })
  );
};

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
  return snapshot.docs.map(
    (doc) =>
      /** @type {CompletedHike} */ ({
        id: doc.id,
        ...doc.data(),
      })
  );
};

// ---------- FRIENDSHIPS ----------

// Add a friendship
export const addFriendship = async (user1, user2) => {
  const friendshipsRef = collection(db, "friendships");
  await addDoc(friendshipsRef, {
    user1,
    user2,
    since: new Date(),
  });
};

// Get all friends for a user
export const getFriends = async (userId) => {
  try {
    // Step 1: Get the user document
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("No user found with UID:", userId);
      return [];
    }

    const userData = userSnap.data();
    const friendUIDs = userData.friends || [];

    // Step 2: Fetch each friend's user data
    const friendDocs = await Promise.all(
      friendUIDs.map(async (uid) => {
        const friend = await getUserFromFirestore(uid);
        return friend ? { id: uid, ...friend } : null;
      })
    );

    // Step 3: Filter out null results
    return friendDocs.filter((f) => f !== null);
  } catch (error) {
    console.error("Failed to get friends:", error);
    return [];
  }
};

/**
 * Wrapper for friend-specific usage.
 * Internally calls the shared completed hike fetcher.
 *
 * @param {string} userId - Friend's UID
 * @param {number} numOfHikes - Optional: number of hikes to retrieve (default 5)
 * @returns {Promise<CompletedHike[]>}
 */
export const getRecentHikesByFriend = async (userId, numOfHikes = 10) => {
  if (typeof userId !== "string") {
    throw new Error("getRecentHikesByFriend: userId must be a string");
  }
  return await getMostRecentCompletedHikes(userId, numOfHikes);
};

// ---------- REVIEWS ----------

// Add a review
export const addReview = async (reviewData) => {
  const reviewsRef = collection(db, "reviews");
  return await addDoc(reviewsRef, {
    ...reviewData,
    createdAt: new Date(),
  });
};

// Get all reviews for a specific hike
export const getReviewsForHike = async (hikeId) => {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, where("hikeId", "==", hikeId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Home Page - Get all reviews
/**
 * Retrieves completed hikes by the user's friends with full hike details.
 *
 * @param {string} userId - The ID of the user whose friends' hikes should be retrieved
 * @param {number} batchSize - Number of hikes to retrieve per batch (default: 10)
 * @param {Object} [lastDoc] - The last document from the previous batch (for pagination)
 * @returns {Promise<{hikeData: Array, lastDoc: Object, hasMore: boolean}>} Complete hike data pairs, pagination info
 */
export const getFriendsCompletedHikesWithDetails = async (
  userId,
  batchSize = 10,
  lastDoc = null
) => {
  try {
    // First, get all the user's friends (unchanged from your current implementation)
    const friendshipsRef = collection(db, "friendships");
    const q1 = query(friendshipsRef, where("user1", "==", userId));
    const q2 = query(friendshipsRef, where("user2", "==", userId));

    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
    ]);

    // Extract friend IDs
    const friendIds = [
      ...snapshot1.docs.map((doc) => doc.data().user2),
      ...snapshot2.docs.map((doc) => doc.data().user1),
    ];

    if (friendIds.length === 0) {
      return { hikeData: [], lastDoc: null, hasMore: false };
    }

    // Build query for completed hikes from all friends (unchanged)
    const completedHikesRef = collection(db, "completedHikes");
    let hikesQuery = query(
      completedHikesRef,
      where("userId", "in", friendIds),
      orderBy("dateCompleted", "desc"),
      limit(batchSize)
    );

    if (lastDoc) {
      hikesQuery = query(hikesQuery, startAfter(lastDoc));
    }

    // Get the completed hikes
    const hikesSnapshot = await getDocs(hikesQuery);
    const completedHikes = hikesSnapshot.docs.map((doc) => ({
      id: doc.id,
      hikeId: doc.data().hikeId,
      userId: doc.data().userId,
      ...doc.data(),
    }));

    // NEW CODE: Fetch full hike details for each completed hike
    const hikeDetailsPromises = completedHikes.map(async (completedHike) => {
      const hikeRef = doc(db, "hikes", completedHike.hikeId);
      const hikeSnap = await getDoc(hikeRef);

      if (hikeSnap.exists()) {
        const hikeData = hikeSnap.data();
        // Return a combined object with both hike details and completion info
        return {
          hike: {
            id: hikeSnap.id,
            ...hikeData,
          },
          completion: completedHike,
          // Add username who completed the hike
          friendId: completedHike.userId,
        };
      }
      return null;
    });

    const hikeData = (await Promise.all(hikeDetailsPromises)).filter(Boolean);

    // Get the last document for next pagination call
    const newLastDoc =
      hikesSnapshot.docs.length > 0
        ? hikesSnapshot.docs[hikesSnapshot.docs.length - 1]
        : null;

    return {
      hikeData,
      lastDoc: newLastDoc,
      hasMore: hikesSnapshot.docs.length === batchSize,
    };
  } catch (error) {
    console.error("Error fetching friends' hikes with details:", error);
    throw new Error("Failed to retrieve friends' hiking activity");
  }
};

// Get all reviews by a specific user
export const getReviewsByUser = async (userId) => {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update a review
export const updateReview = async (reviewId, updates) => {
  const reviewRef = doc(db, "reviews", reviewId);
  await updateDoc(reviewRef, updates);
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const reviewRef = doc(db, "reviews", reviewId);
  await deleteDoc(reviewRef);
};

// ---------- SEARCH FUNCTIONALITY ----------

/**
 * Searches hikes by title with closest matches first
 * @param {string} searchTerm - The term to search for
 * @returns {Promise<HikeEntity[]>} Array of matching hikes
 */
export const searchHikes = async (searchTerm) => {
  try {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return [];

    // Get all hikes with proper typing
    const allHikes = await getAllHikes();

    // Filter and sort client-side
    const filteredHikes = allHikes.filter((hike) =>
      hike.title.toLowerCase().includes(term)
    );

    filteredHikes.sort((a, b) => {
      const aStartsWith = a.title.toLowerCase().startsWith(term);
      const bStartsWith = b.title.toLowerCase().startsWith(term);

      // Starts-with matches come first
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    });

    return filteredHikes;
  } catch (error) {
    console.error("Error searching hikes:", error);
    return [];
  }
};

/**
 * Searches users by name or username (excluding current user)
 * @param {string} searchTerm - The term to search for
 * @param {string} currentUserId - The ID of the current user to exclude
 * @returns {Promise<UserProfile[]>} Array of matching users
 */
export const searchUsers = async (searchTerm, currentUserId) => {
  try {
    // Normalize search term
    const term = searchTerm.toLowerCase().trim();
    if (!term) return [];

    // Get all users with proper typing
    const allUsers = await getAllUsers();

    // Filter out current user and search matches
    const filteredUsers = allUsers
      .filter((user) => user.id !== currentUserId)
      .filter((user) => {
        return (
          user.name.toLowerCase().includes(term) ||
          (user.username && user.username.toLowerCase().includes(term))
        );
      });

    // Sort by best match
    filteredUsers.sort((a, b) => {
      const aNameStarts = a.name.toLowerCase().startsWith(term);
      const bNameStarts = b.name.toLowerCase().startsWith(term);
      const aUsernameStarts =
        a.username && a.username.toLowerCase().startsWith(term);
      const bUsernameStarts =
        b.username && b.username.toLowerCase().startsWith(term);

      // Prioritize name matches
      if (aNameStarts && !bNameStarts) return -1;
      if (!aNameStarts && bNameStarts) return 1;

      // Then prioritize username matches
      if (aUsernameStarts && !bUsernameStarts) return -1;
      if (!aUsernameStarts && bUsernameStarts) return 1;

      return 0;
    });

    return filteredUsers;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};
