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

/**
 * Get the average rating and total number of reviews for a specific hike
 *
 * @param {string} hikeId - ID of the hike
 * @returns {Promise<{average: number, count: number}>} Object containing average rating and review count
 */
export const getHikeRatingStats = async (hikeId) => {
  const reviewsRef = collection(db, "completedHikes");
  const q = query(reviewsRef, where("hikeId", "==", hikeId));
  const snapshot = await getDocs(q);

  const reviews = snapshot.docs.map((doc) => doc.data());
  const count = reviews.length;

  if (count === 0) {
    return { average: 0, count: 0 };
  }

  // Calculate average rating
  const sum = reviews.reduce((total, review) => {
    const rating = parseFloat(review.rating);
    return isNaN(rating) ? total : total + rating;
  }, 0);

  const average = sum / count;
  const roundedAverage = Math.ceil(average);

  return { average: roundedAverage, count };
};
