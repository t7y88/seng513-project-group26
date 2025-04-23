import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; 

/**
 * Deletes all hikes listed in hike_entity_stubs.json by hikeId.
 */
export async function deleteSeededHikes() {
    
  const res = await fetch("/data/hike_entity_stubs.json");
  const hikeEntities = await res.json();

  try {
    console.log("Starting cleanup...");

    for (const hike of hikeEntities) {
      const hikeId = hike.hikeId;
      if (!hikeId) continue;

      const hikeRef = doc(db, "hikes", hikeId);
      await deleteDoc(hikeRef);
      console.log(`🗑️ Deleted hike: ${hike.title}`);
    }

    console.log("✅ Cleanup complete.");
  } catch (err) {
    console.error("❌ Error deleting hikes:", err);
  }
}



/**
 * Deletes all hikes in the "hikes" collection where the image URL starts with Pexels.
 */
export async function deletePexelsHikes() {
  try {
    const hikesRef = collection(db, "hikes");
    const snapshot = await getDocs(hikesRef);
    let deletedCount = 0;

    for (const docSnap of snapshot.docs) {
      const hike = docSnap.data();
      const hikeId = docSnap.id;

      if (hike.image?.startsWith("https://images.pexels.com")) {
        await deleteDoc(doc(db, "hikes", hikeId));
        console.log(`🗑️ Deleted: ${hike.title || hikeId}`);
        deletedCount++;
      }
    }

    console.log(`✅ Finished. Deleted ${deletedCount} hike(s) with Pexels images.`);
  } catch (err) {
    console.error("❌ Error deleting hikes with Pexels images:", err);
  }
}


/**
 * Creates or overwrites a hike with the given hikeId as the doc ID.
 * @param {HikeEntity} hikeData
 */
export async function createJSONHike(hikeData) {
  if (!hikeData.hikeId) {
    throw new Error("Missing hikeId in hike data.");
  }

  const hikeRef = doc(db, "hikes", hikeData.hikeId); // use hikeId as doc ID

  await setDoc(hikeRef, hikeData); // this overwrites if it already exists
}
