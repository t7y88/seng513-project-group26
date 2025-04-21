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
  documentId,
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
/**
 * Retrieves a user's profile data from Firestore.
 *
 * @param {string} userId - The ID of the user to retrieve
 * @returns {Promise<UserProfile|null>} The user profile or null if not found
 */
export const getUserFromFirestore = async (userId) => {
  try {
    console.log(`Attempting to fetch user with ID: ${userId}`);
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("User document found:", userSnap.data());
      return /** @type {UserProfile} */ ({
        id: userSnap.id,
        ...userSnap.data(),
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

// ---------- HIKES ----------
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
    await setDoc(hikeRef, hike, { merge: true }); // Creates or overwrites the doc with ID = hikeId
    console.log(`Successfully added hike: ${hike.id}`);
  } catch (error) {
    console.error(`Failed to add hike: ${hike?.id}:`, error);
    throw new Error("Failed to add hike. Please try again.");
  }
};

// 1. Add a hike
export const addHike = async (hikeData) => {
  try {
    const hikesRef = collection(db, "hikes");
    const hikeDoc = await addDoc(hikesRef, hikeData);
    return hikeDoc.id;
  } catch (error) {
    console.error("Error adding hike:", error);
    throw new Error("Failed to add hike");
  }
};

// 2. Get all hikes
export const getAllHikes = async () => {
  const hikesRef = collection(db, "hikes");
  const snapshot = await getDocs(hikesRef);
  return snapshot.docs.map(
    (doc) => /** @type {HikeEntity} */ ({ id: doc.id, ...doc.data() })
  );
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
 * - This composite ID is generated by the helper utility function <generateHikeId()>
 *
 * @param {CompletedHike} data
 * @throws {Error} If required fields are missing or if the document (tuple) was not inserted into the Collection (database)
 *
 * @author aidan
 */
export const createCompletedHike = async ({
  userId,
  hikeId,
  rating,
  notes,
  dateCompleted,
}) => {
  if (!userId || !hikeId || typeof rating !== "number") {
    throw new Error("Missing required hike data (userId, hikeId, or rating)");
  }

  const date = normalizeDate(dateCompleted ?? new Date());
  // The document ID aka Primary key is a combination of - userID, hikeId, and date - (aka a composite primary key)
  const docId = generateHikeDocId(userId, hikeId, date);
  // We insert the completed hike data into the completedHikes collection
  const ref = doc(db, "completedHikes", docId);

  try {
    await setDoc(ref, {
      userId,
      hikeId,
      rating,
      notes,
      dateCompleted: date,
      createdAt: new Date(),
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
/**
 * Retrieves a friendship between two users.
 * This function checks both directions (user1 to user2 and user2 to user1).
 * If a friendship exists in either direction, it will be returned.
 *
 * @param {string} user1 - The ID of the first user.
 * @param {string} user2 - The ID of the second user.
 * @returns {Promise<Friendship[]>} A promise that resolves to an array of friendship objects.
 * @throws {Error} If an error occurs while fetching the friendship.
 *
 * @author Kyle
 **/

export const getFriendship = async (user1, user2) => {
  const friendshipsRef = collection(db, "friendships");
  // Check both directions
  const q1 = query(
    friendshipsRef,
    where("user1", "==", user1),
    where("user2", "==", user2)
  );
  const q2 = query(
    friendshipsRef,
    where("user1", "==", user2),
    where("user2", "==", user1)
  );

  const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

  const results = [
    ...snapshot1.docs.map((doc) => ({
      id: doc.id,
      user1: doc.data().user1,
      user2: doc.data().user2,
      since: doc.data().since,
    })),
    ...snapshot2.docs.map((doc) => ({
      id: doc.id,
      user1: doc.data().user1,
      user2: doc.data().user2,
      since: doc.data().since,
    })),
  ];

  return /** @type {Friendship[]} */ (results);
};
/**
 * Requests a friendship between two users.
 * This function creates a new document in the `friendships` collection with
 * the user IDs and the status set to "pending".
 *
 * @param {string} user1 - The ID of the first user.
 * @param {string} user2 - The ID of the second user.
 * @returns {Promise<void>} A promise that resolves when the friendship request has been sent.
 * @throws {Error} If an error occurs while sending the friendship request.
 *
 * @author Kyle
 **/

export const requestFriendship = async (user1, user2) => {
  const friendshipsRef = collection(db, "friendships");
  await addDoc(friendshipsRef, {
    user1,
    user2,
    status: "pending",
    since: new Date(),
  });
};

/**
 * Retrieves all pending friendship requests for a specific user.
 * This function queries the `friendships` collection for documents
 * where the user is either user1 or user2 and the status is "pending".
 *
 * @param {string} userId - The ID of the user whose pending requests should be retrieved.
 * @returns {Promise<Friendship[]>} A promise that resolves to an array of pending friendship requests.
 * @throws {Error} If an error occurs while fetching the pending requests.
 *
 * @author Kyle
 **/
export const getAllPendingFriendship = async (userId) => {
  const friendshipsRef = collection(db, "friendships");
  const q = query(
    friendshipsRef,
    where("user1", "==", userId),
    where("status", "==", "pending")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    user1: doc.data().user1,
    user2: doc.data().user2,
    since: doc.data().since,
  }));
};

/**
 * Accepts a friendship request between two users.
 * This function updates the status of the friendship document
 * to "accepted".
 *
 * @param {string} friendshipId - The ID of the friendship document to update.
 * @returns {Promise<void>} A promise that resolves when the friendship has been accepted.
 * @throws {Error} If an error occurs while accepting the friendship.
 *
 * @author Kyle
 **/
export const removeFriendship = async (friendshipId) => {
  const friendshipRef = doc(db, "friendships", friendshipId);
  await deleteDoc(friendshipRef);
};

/**
 * Adds a friendship between two users to the Firestore database.
 * This function creates a new document in the `friendships` collection with the user IDs and the date the friendship was established.
 *
 * @param {string} user1 - The ID of the first user.
 * @param {string} user2 - The ID of the second user.
 * @returns {Promise<void>} A promise that resolves when the friendship has been added.
 * @throws {Error} If an error occurs while adding the friendship.
 *
 * */
export const addFriendship = async (user1, user2) => {
  const friendshipsRef = collection(db, "friendships");
  await addDoc(friendshipsRef, {
    user1,
    user2,
    status: "accepted",
    since: new Date(),
  });
};

/**
 * Retrieves all friends of a specific user with improved efficiency.
 *
 * @param {string} userId - The ID of the user whose friends should be retrieved.
 * @param {number} [maxlimit=50] - Maximum number of friends to retrieve
 * @returns {Promise<UserProfile[]>} A promise that resolves to an array of user profiles
 * @throws {Error} If an error occurs while fetching the friends.
 */
export const getFriends = async (userId, maxlimit = 50) => {
  try {
    console.log(`Getting friends for user: ${userId}`);

    if (!userId) throw new Error("userId is required");

    const friendshipsRef = collection(db, "friendships");

    // Get friendships where user is either user1 or user2
    const q1 = query(
      friendshipsRef,
      where("user1", "==", userId),
      where("status", "==", "accepted"),
      limit(maxlimit)
    );

    const q2 = query(
      friendshipsRef,
      where("user2", "==", userId),
      where("status", "==", "accepted"),
      limit(maxlimit)
    );

    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
    ]);

    console.log(
      `Found ${snapshot1.docs.length + snapshot2.docs.length} friendships`
    );

    const friendIds = new Set([
      ...snapshot1.docs.map((doc) => doc.data().user2),
      ...snapshot2.docs.map((doc) => doc.data().user1),
    ]);

    console.log(`Extracted ${friendIds.size} unique friend IDs`);

    if (friendIds.size === 0) {
      return [];
    }

    const usersRef = collection(db, "users");
    const friendData = [];

    // Process in batches of 10 (Firestore's 'in' operator limit)
    const idBatches = Array.from(friendIds).reduce((batches, id, index) => {
      const batchIndex = Math.floor(index / 10);
      if (!batches[batchIndex]) batches[batchIndex] = [];
      batches[batchIndex].push(id);
      return batches;
    }, []);

    // Process each batch
    for (const batch of idBatches) {
      try {
        const batchQuery = query(usersRef, where(documentId(), "in", batch));
        const batchSnapshot = await getDocs(batchQuery);

        console.log(`Batch fetched ${batchSnapshot.docs.length} users`);

        batchSnapshot.docs.forEach((doc) => {
          if (doc.exists()) {
            friendData.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
      } catch (batchError) {
        console.error(`Error processing batch: ${batchError.message}`);
      }
    }

    return friendData;
  } catch (error) {
    console.error("Failed to get friends:", error);
    throw new Error(`Failed to retrieve friends: ${error.message}`);
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
export const getRecentHikesByFriend = async (userId, numOfHikes = 5) => {
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
