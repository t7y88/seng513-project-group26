// utils/saveHikeChanges.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const saveHikeChanges = async (hikeId, updatedData) => {
  const hikeRef = doc(db, "hikes", hikeId);
  await updateDoc(hikeRef, updatedData);
};
