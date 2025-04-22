// @ts-check
/// <reference path="../../types/firestoreModels.js" />

import { db } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  documentId,
} from "firebase/firestore";
import { getUserFromFirestore } from "./userService";
import { getMostRecentCompletedHikes } from "./completedHikeService";
import { getMostRecentWishlistedHikes } from "./wishlistService";
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
      status: doc.data().status,
      since: doc.data().since,
      senderId: doc.data().user1, // user1 is always the sender
    })),
    ...snapshot2.docs.map((doc) => ({
      id: doc.id,
      user1: doc.data().user1,
      user2: doc.data().user2,
      status: doc.data().status,
      since: doc.data().since,
      senderId: doc.data().user1, // user1 is always the sender
    })),
  ];

  return results;
};
/**
 * Requests a friendship between two users after verifying both users exist.
 *
 * @param {string} user1 - The ID of the first user.
 * @param {string} user2 - The ID of the second user.
 * @returns {Promise<void>} A promise that resolves when the friendship request has been sent.
 * @throws {Error} If either user doesn't exist or if an error occurs while sending the request.
 */
export const requestFriendship = async (user1, user2) => {
  // Validate input parameters
  if (!user1 || !user2) {
    throw new Error("Both user IDs are required");
  }

  if (user1 === user2) {
    throw new Error("Cannot create friendship with yourself");
  }

  // Check if both users exist
  const [user1Exists, user2Exists] = await Promise.all([
    getUserFromFirestore(user1),
    getUserFromFirestore(user2),
  ]);

  if (!user1Exists) {
    throw new Error(`User with ID ${user1} doesn't exist`);
  }

  if (!user2Exists) {
    throw new Error(`User with ID ${user2} doesn't exist`);
  }

  // Check if friendship already exists
  const existingFriendship = await getFriendship(user1, user2);
  if (existingFriendship && existingFriendship.length > 0) {
    throw new Error(
      "A friendship or request already exists between these users"
    );
  }

  // Create the friendship request
  const friendshipsRef = collection(db, "friendships");
  await addDoc(friendshipsRef, {
    user1,
    user2,
    status: "pending",
    since: new Date(),
  });

  console.log(`Friendship request created between ${user1} and ${user2}`);
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
  // Get requests sent to this user (where they are user2)
  const q1 = query(
    friendshipsRef,
    where("user2", "==", userId),
    where("status", "==", "pending")
  );
  // Get requests sent by this user (where they are user1)
  const q2 = query(
    friendshipsRef,
    where("user1", "==", userId),
    where("status", "==", "pending")
  );

  const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

  return [
    ...snapshot1.docs.map((doc) => ({
      id: doc.id,
      user1: doc.data().user1,
      user2: doc.data().user2,
      status: doc.data().status,
      since: doc.data().since,
      senderId: doc.data().user1,
    })),
    ...snapshot2.docs.map((doc) => ({
      id: doc.id,
      user1: doc.data().user1,
      user2: doc.data().user2,
      status: doc.data().status,
      since: doc.data().since,
      senderId: doc.data().user1,
    })),
  ];
};

export const acceptFriendship = async (friendshipId) => {
  const friendshipRef = doc(db, "friendships", friendshipId);
  await updateDoc(friendshipRef, {
    status: "accepted",
  });
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
 * Adds a direct friendship between two users after verifying both users exist.
 *
 * @param {string} user1 - The ID of the first user.
 * @param {string} user2 - The ID of the second user.
 * @returns {Promise<void>} A promise that resolves when the friendship has been added.
 * @throws {Error} If either user doesn't exist or if an error occurs while adding the friendship.
 */
export const addFriendship = async (user1, user2) => {
  // Validate input parameters
  if (!user1 || !user2) {
    throw new Error("Both user IDs are required");
  }

  if (user1 === user2) {
    throw new Error("Cannot create friendship with yourself");
  }

  // Check if both users exist
  const [user1Exists, user2Exists] = await Promise.all([
    getUserFromFirestore(user1),
    getUserFromFirestore(user2),
  ]);

  if (!user1Exists) {
    throw new Error(`User with ID ${user1} doesn't exist`);
  }

  if (!user2Exists) {
    throw new Error(`User with ID ${user2} doesn't exist`);
  }

  // Check if friendship already exists
  const existingFriendship = await getFriendship(user1, user2);
  if (existingFriendship && existingFriendship.length > 0) {
    throw new Error("A friendship already exists between these users");
  }

  // Create the friendship with accepted status
  const friendshipsRef = collection(db, "friendships");
  await addDoc(friendshipsRef, {
    user1,
    user2,
    status: "accepted",
    since: new Date(),
  });

  console.log(`Direct friendship created between ${user1} and ${user2}`);
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

    // console.log(
    //   `Found ${snapshot1.docs.length + snapshot2.docs.length} friendships`
    // );

    const friendIds = new Set([
      ...snapshot1.docs.map((doc) => doc.data().user2),
      ...snapshot2.docs.map((doc) => doc.data().user1),
    ]);

    // console.log(`Extracted ${friendIds.size} unique friend IDs`);

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

        // console.log(`Batch fetched ${batchSnapshot.docs.length} users`);

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
export const getRecentHikesByFriend = async (userId, numOfHikes = 10) => {
  if (typeof userId !== "string") {
    throw new Error("getRecentHikesByFriend: userId must be a string");
  }
  return await getMostRecentCompletedHikes(userId, numOfHikes);
};

/**
 * Retrieves recent wishlisted hikes by a friend (wrapper function).
 *
 * @param {string} userId - Friend's UID.
 * @param {number} numOfHikes - Optional: number of hikes (default 10).
 * @returns {Promise<WishlistedHike[]>}
 * @author noshin
 */
export const getRecentWishlistByFriend = async (userId, numOfHikes = 10) => {
  if (typeof userId !== "string") {
    throw new Error("getRecentWishlistByFriend: userId must be a string");
  }
  return await getMostRecentWishlistedHikes(userId, numOfHikes);
};
