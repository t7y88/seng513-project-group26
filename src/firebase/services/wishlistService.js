// @ts-check
/// <reference path="../../types/firestoreModels.js" />

import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  getDoc,
} from "firebase/firestore";
import {
  generateWishlistDocId,
  getWishlistTimestamp,
} from "../../../utils/wishlistUtils.js";
/**
 * Adds a hike to the user's wishlist if it doesn't already exist.
 * The document ID is composed of userId and hikeId to enforce uniqueness.
 *
 * @param {WishlistedHike} data - Data for the wishlisted hike.
 * @param {string} data.userId - ID of the user.
 * @param {string} data.username - Username of the user.
 * @param {string} data.hikeId - ID of the hike.
 * @throws {Error} If required fields are missing or if the write fails.
 * @returns {Promise<{success: boolean, alreadyExists?: boolean}>}
 * @author noshin
 */
export const createWishlistedHike = async ({ userId, username, hikeId }) => {
  if (!userId || !username || !hikeId) {
    throw new Error(
      "Missing required wishlist data (userId, username, hikeId)."
    );
  }

  const docId = generateWishlistDocId(userId, hikeId);
  const ref = doc(db, "wishlistedHikes", docId);

  try {
    // Check if document already exists
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      // Document already exists, don't create a duplicate
      return { success: true, alreadyExists: true };
    }

    // Document doesn't exist, create it
    await setDoc(ref, {
      id: docId,
      userId,
      username,
      hikeId,
      wishlistedAt: getWishlistTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to wishlist hike:", error);
    throw new Error("Failed to add hike to wishlist. Please try again.");
  }
};

/**
 * Removes a hike from the user's wishlist.
 *
 * @param {WishlistedHike} wishlistedHike - Object with userId and hikeId.
 * @throws {Error} If fields are missing or if Firestore deletion fails.
 * @returns {Promise<void>}
 * @author noshin
 */
export const removeWishlistedHike = async (wishlistedHike) => {
  const { userId, hikeId } = wishlistedHike;

  if (!userId || !hikeId) {
    throw new Error("Missing required fields: userId or hikeId.");
  }

  const docID = generateWishlistDocId(userId, hikeId);
  const ref = doc(db, "wishlistedHikes", docID);

  try {
    await deleteDoc(ref);
  } catch (error) {
    console.error("Failed to delete wishlisted hike:", error);
    throw new Error(
      "An error occurred while trying to remove the wishlisted hike."
    );
  }
};

/**
 * Retrieves all wishlisted hikes for a user.
 * Sorted by `wishlistedAt` in descending order (most recent first).
 *
 * @param {string} userId - ID of the user.
 * @returns {Promise<WishlistedHike[]>} Array of wishlisted hikes.
 * @author noshin
 */
export const getWishlistedHikes = async (userId) => {
  const ref = collection(db, "wishlistedHikes");

  const q = query(
    ref,
    where("userId", "==", userId),
    orderBy("wishlistedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    // Making sure the data structure matches the `WishlistedHike` type
    return {
      id: doc.id, // Firestore document ID (userId_hikeId)
      userId: data.userId || "", // userId from Firestore document
      username: data.username || "", // username from Firestore document
      hikeId: data.hikeId || "", // hikeId from Firestore document
      createdAt: data.createdAt || new Date(), // Timestamp of when the hike was wishlisted
    };
  });
};

/**
 * Retrieves a limited number of the most recent wishlisted hikes.
 *
 * @param {string} userId - ID of the user.
 * @param {number} numOfHikes - Number of hikes to return.
 * @returns {Promise<WishlistedHike[]>}
 * @author noshin
 */
export const getMostRecentWishlistedHikes = async (userId, numOfHikes) => {
  const ref = collection(db, "wishlistedHikes");

  const q = query(
    ref,
    where("userId", "==", userId),
    orderBy("wishlistedAt", "desc"),
    limit(numOfHikes)
  );

  const snapshot = await getDocs(q);

  // Map the Firestore documents to the WishlistedHike structure
  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id, // Firestore document ID (userId_hikeId)
      userId: data.userId || "", // Ensure userId is set or fallback to an empty string
      username: data.username || "", // Ensure username is set or fallback to an empty string
      hikeId: data.hikeId || "", // Ensure hikeId is set or fallback to an empty string
      createdAt: data.createdAt || new Date(), // Default to current date if createdAt is missing
    };
  });
};

/**
 * Retrieves a specific wishlisted hike by its ID.
 *
 * @param {string} userId - ID of the user.
 * @param {string} hikeId - ID of the hike.
 * @returns {Promise<WishlistedHike | null>} The wishlisted hike or null if not found.
 */
export const getWishlistedHikeById = async (userId, hikeId) => {
  const docId = generateWishlistDocId(userId, hikeId);
  const ref = doc(db, "wishlistedHikes", docId);

  try {
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId || "",
        username: data.username || "",
        hikeId: data.hikeId || "",
        createdAt: data.createdAt || new Date(),
      };
    } else {
      return null; // Document does not exist
    }
  } catch (error) {
    console.error("Failed to fetch wishlisted hike:", error);
    throw new Error("Failed to fetch wishlisted hike.");
  }
};

/**
 * Remove wishlisted hikes by userId and hikeId.
 * @param {string} userId - ID of the user.
 * @param {string} hikeId - ID of the hike.
 * @returns {Promise<void>}
 * @throws {Error} If the deletion fails.
 * @author Kyle
 */
export const removeWishlistedHikeById = async (userId, hikeId) => {
  const docId = generateWishlistDocId(userId, hikeId);
  const ref = doc(db, "wishlistedHikes", docId);

  try {
    await deleteDoc(ref);
  } catch (error) {
    console.error("Failed to delete wishlisted hike:", error);
    throw new Error("Failed to delete wishlisted hike.");
  }
};
