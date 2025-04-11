import { db } from "./firebase";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, query, where } from "firebase/firestore";

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

// 3. Add a hike
export const addHike = async (hikeData) => {
  const hikesRef = collection(db, "hikes");
  const hikeDoc = await addDoc(hikesRef, hikeData);
  return hikeDoc.id;
};

// 4. Get all hikes
export const getAllHikes = async () => {
  const hikesRef = collection(db, "hikes");
  const snapshot = await getDocs(hikesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 5. Add a friendship
export const addFriendship = async (user1, user2) => {
  const friendshipsRef = collection(db, "friendships");
  await addDoc(friendshipsRef, {
    user1,
    user2,
    since: new Date()
  });
};
