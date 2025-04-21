import { createUserInFirestore, createHike, addReview } from "./firestore";
import { sampleUsers } from "../stubs/sampleUsers";
import { hikeEntities } from "../stubs/hikeEntities";
import { reviewEntities } from "../stubs/reviewEntities";
import { completedHikes } from "../stubs/completedHikes";
import { addFieldToDocs, addDocIdToAllDocs } from "./addFieldToDocs";


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
} from "firebase/firestore";


/**
 */
const populateFirestoreWithCompletedHikeStubs = async (hikeData) => {
  console.log("Hike object:", hikeData);
  console.log("Hike ID:", hikeData.id);
  await setDoc(doc(db, "completedHikes", hikeData.id), {
    id: hikeData.id,
    userId: hikeData.userId,
    username: hikeData.username,
    hikeId: hikeData.hikeId,
    rating: hikeData.rating,
    dateCompleted: hikeData.dateCompleted,
    timeToComplete: hikeData.timeToComplete,
    timeUnit: hikeData.timeUnit,
    notes: hikeData.notes,
    createdAt: new Date(),
  });
};

// Utility function to delay for Firestore write limits (optional but safe)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const seedFirestore = async () => {


  //// Add field to users
  //addFieldToDocs("users", "admin", false);


  //// Add docId field to all users
  //addDocIdToAllDocs("users");


  // //--- Seed Hikes ---
  // try {
  //   console.log("Seeding hikes...");
  //   for (const hikeId in hikeEntities) {
  //     const hikeData = hikeEntities[hikeId];
  //     await createHike(hikeData);
  //     console.log(`Added hike: ${hikeData.title}`);
  //   }
  //   console.log("Hikes seeded successfully!");
  // } catch (error) {
  //   console.error("Error seeding hikes:", error);
  // }

  // //--- Seed Completed Hikes ---
  // try {
  //   console.log("Seeding completed hikes...");
  //   for (const hikeData of completedHikes) {
  //     await populateFirestoreWithCompletedHikeStubs(hikeData);
  //     console.log(`Added completed hike: ${hikeData.id}`);
  //   }
  //   console.log("Completed hikes were seeded successfully!");
  // } catch (error) {
  //   console.error("Error seeding completed hikes:", error);
  // }

  

  // --- Seed Users ---
  // try {
  //   console.log("Seeding users...");
  //   for (const user of sampleUsers) {
  //     const { username, ...userData } = user;
  //     await createUserInFirestore(username, userData);
  //     console.log(`Added user: ${username}`);
  //     await delay(100);
  //   }
  //   console.log("Firestore users seeded successfully!");
  // } catch (err) {
  //   console.error("Error seeding users Firestore:", err);
  // }

  // --- Seed Reviews ---
  // try {
  //   console.log("Seeding reviews...");
  //   for (const review of reviewEntities) {
  //     await addReview(review);
  //     console.log(`Added review for hike ${review.hikeId} by ${review.userId}`);
  //     await delay(100);
  //   }

  //   // Un-comment this when you're ready to seed completed hikes
  //   // console.log("Seeding completed hikes...");
  //   // for (const hike of completedHikes) {
  //   //   await createCompletedHike(hike);
  //   //   console.log(`Added completed hike: ${hike.docId}`);
  //   //   await delay(100);
  //   // }

  //   console.log("Firestore reviews seeded successfully!");
  // } catch (err) {
  //   console.error("Error seeding reviews Firestore:", err);
  // }
};




export { seedFirestore };
