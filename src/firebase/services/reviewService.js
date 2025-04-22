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
  orderBy,
  limit,
  startAfter,
  getDoc,
} from "firebase/firestore";

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
