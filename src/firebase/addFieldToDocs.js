import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";


export async function addFieldToDocs(collectionName, newFieldName, newValue) {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);

  const updates = snapshot.docs.map(async (docSnap) => {
    const docRef = doc(db, collectionName, docSnap.id);
    return updateDoc(docRef, {
      [newFieldName]: newValue
    });
  });

  await Promise.all(updates);
  console.log(`Added field '${newFieldName}' to all documents in '${collectionName}'`);
}

export async function addDocIdToAllDocs(collectionName) {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);

  const updates = snapshot.docs.map(async (docSnap) => {
    const docRef = doc(db, collectionName, docSnap.id);

    // Safety check: only update if docSnap.id is defined
    if (!docSnap.id) return;

    return updateDoc(docRef, {
      id: docSnap.id,
    });
  });

  await Promise.all(updates);
  console.log(`Added 'id' field to all documents in '${collectionName}'`);
}

