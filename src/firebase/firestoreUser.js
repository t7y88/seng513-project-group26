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
  arrayRemove,
} from "firebase/firestore";

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
  const userReference = doc(db, "users", uid);
  const userSnapshot = await getDoc(userReference);

  if (!userSnapshot.exists()) {
    console.error(`User with UID ${uid} not found.`);
    return;
  }

  try {
    await updateDoc(userReference, {
      admin: isAdmin,
    });
    console.log(`Updated admin status for UID ${uid} to ${isAdmin}`);
  } catch (err) {
    console.error("Failed to update admin status:", err);
  }
};

// /**
//  * Creates or updates a user document with the guest role.
//  *
//  * @param {boolean} isGuest - A boolean value indicating whether the user should be marked as an guest (true) or not (false).
//  * @returns {Promise<void>} A Promise that resolves when the operation is complete.
//  */

// export const createUserGuestStatus = async(isGuest) =>

/**
 * Retrieves all HikeEntity documents from a user's `wishlist` field.
 *
 * @param {string} uid - The UID of the user
 * @returns {Promise<HikeEntity[]>} Array of HikeEntity objects
 */
export const getUserHikeWishlist = async (uid) => {
  const userReference = doc(db, "users", uid);
  const userSnapshot = await getDoc(userReference);

  if (!userSnapshot.exists()) {
    console.error(`User with UID ${uid} not found. Cannot retrieve wishlist.`);
    return [];
  }

  const wishlist = userSnapshot.data().wishlist;

  if (!Array.isArray(wishlist) || wishlist.length === 0) {
    return []; // No wishlist
  }

  const hikesRef = collection(db, "hikes");
  const hikeResults = [];

  // Firestore limits queries to 10 elements per batch.
  const batchSize = 10;
  for (let i = 0; i < wishlist.length; i += batchSize) {
    const batch = wishlist.slice(i, i + batchSize);
    const queryTenHikeEntities = query(
      hikesRef,
      where(documentId(), "in", batch)
    );
    const snapshot = await getDocs(queryTenHikeEntities);

    snapshot.docs.forEach((docSnap) => {
      hikeResults.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });
  }
  return /** @type {HikeEntity[]} */ (hikeResults);
};

/**
 * Removes a hike's document ID from a user's wishlist array.
 *
 * @param {string} userId - The Firestore document ID of the user.
 * @param {string} hikeIdToRemove - The hike doc ID to remove from the wishlist.
 * @returns {Promise<void>}
 */
export const removeHikeFromWishlist = async (userId, hikeIdToRemove) => {
  if (!userId || !hikeIdToRemove) {
    throw new Error(
      "The document ID for the UserProfile and the HikeEntity must be provided."
    );
  }

  const userReference = doc(db, "users", userId);

  try {
    await updateDoc(userReference, {
      wishlist: arrayRemove(hikeIdToRemove),
    });
    console.log(
      `Removed hike ${hikeIdToRemove} from user ${userId}'s wishlist.`
    );
  } catch (error) {
    console.error("Error removing hike from wishlist:", error);
    throw error;
  }
};
