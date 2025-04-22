// firebase/services/userDeletionService.js

import { db, auth } from "../firebase.js";
import { doc, deleteDoc, getDocs, collection, query, where } from "firebase/firestore";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

// Delete Firestore user data
export async function deleteFirestoreUserData(userId) {
  try {
    // 1. Delete user profile
    await deleteDoc(doc(db, "users", userId));

    // 2. Delete completed hikes
    const completedQuery = query(
      collection(db, "completedHikes"),
      where("userId", "==", userId)
    );
    const completedSnapshot = await getDocs(completedQuery);
    for (const docSnap of completedSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }

    // 3. Delete wishlisted hikes
    const wishlistQuery = query(
      collection(db, "wishlistedHikes"),
      where("userId", "==", userId)
    );
    const wishlistSnapshot = await getDocs(wishlistQuery);
    for (const docSnap of wishlistSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }

    // 4. Delete friendships (user1 or user2)
    const friendshipQuery1 = query(
      collection(db, "friendships"),
      where("user1", "==", userId)
    );
    const friendshipQuery2 = query(
      collection(db, "friendships"),
      where("user2", "==", userId)
    );

    const friendshipSnapshots = [
      await getDocs(friendshipQuery1),
      await getDocs(friendshipQuery2),
    ];

    for (const snapshot of friendshipSnapshots) {
      for (const docSnap of snapshot.docs) {
        await deleteDoc(docSnap.ref);
      }
    }

    console.log(" Firestore data deleted for user:", userId);
  } catch (error) {
    console.error(" Error deleting Firestore data:", error);
    throw error;
  }
}

// Trying to delete Firebase Auth account
export async function tryDeleteAuthAccount(user) {
  try {
    await deleteUser(user);
    console.log(" Auth account deleted");
    return { success: true };
  } catch (error) {
    if (error.code === "auth/requires-recent-login") {
      console.warn(" Re-authentication required");
      return { success: false, reason: "reauth" };
    }
    console.error(" Failed to delete auth account:", error);
    return { success: false, reason: error.message };
  }
}

// Re-authenticating with email + password
export async function reauthenticateUser(user, password) {
  const credential = EmailAuthProvider.credential(user.email, password);
  return reauthenticateWithCredential(user, credential);
}
