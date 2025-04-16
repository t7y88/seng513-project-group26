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
  const hikesRef = collection(db, "hikes");
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
