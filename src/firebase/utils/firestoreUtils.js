import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export const docExists = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

export const queryCollection = async (
  collectionName,
  fieldPath,
  operator,
  value
) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where(fieldPath, operator, value));
  return getDocs(q);
};
