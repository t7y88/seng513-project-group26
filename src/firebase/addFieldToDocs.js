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


