// @ts-check
/// <reference path="../../types/firestoreModels.js" />

import { db } from "../firebase";
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
  writeBatch,
} from "firebase/firestore";

import { sluggify } from "../../../utils/slugify";

/**
 * Adds a hike to Firestore using an auto-generated document ID.
 * The generated ID is also saved as the `id` field inside the document.
 *
 * @param {HikeEntity} hike - The hike data to store.
 * @returns {Promise<string>} The generated document ID.
 */
export const createHike = async (hike) => {
  try {
    const hikesRef = collection(db, "hikes");

    // Temporarily add the doc without an `id` so we can get one from Firestore
    const docRef = await addDoc(hikesRef, { ...hike });

    // Add the generated ID to the document itself under `id`
    await updateDoc(docRef, { id: docRef.id });

    console.log(`Successfully added hike: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Failed to add hike:", error);
    throw new Error("Failed to add hike. Please try again.");
  }
};

/**
 * Adds a hike to Firestore with an auto-generated document ID,
 * and stores that ID in the `id` field of the document itself.
 *
 * @param {HikeEntity} hikeData - The hike data to store.
 * @returns {Promise<string>} The Firestore-generated document ID.
 */
export const addHike = async (hikeData) => {
  try {
    const hikesRef = collection(db, "hikes");

    // Step 1: Add the hike (Firestore generates the ID)
    const docRef = await addDoc(hikesRef, hikeData);

    // Step 2: Update the same doc with its generated ID in the `id` field
    await setDoc(docRef, { ...hikeData, id: docRef.id }, { merge: true });

    console.log(`Added hike with Firestore ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error adding hike:", error);
    throw new Error("Failed to add hike.");
  }
};

/**
 * Retrieves a single hike from Firestore by its document ID.
 *
 * @param {string} id - The Firestore document ID of the hike.
 * @returns {Promise<HikeEntity|null>} The hike object (with `id` field), or null if not found.
 */
export const getHikeById = async (id) => {
  try {
    const hikeRef = doc(db, "hikes", id);
    const hikeSnap = await getDoc(hikeRef);

    if (!hikeSnap.exists()) {
      console.warn(`No hike found with ID: ${id}`);
      return null;
    }

    return /** @type {HikeEntity} */ ({
      id: hikeSnap.id,
      ...hikeSnap.data(),
    });
  } catch (error) {
    console.error(`Failed to fetch hike with ID ${id}:`, error);
    throw new Error("Error retrieving hike");
  }
};

/**
 * Retrieves the full hike document using the custom `hikeId` field (not the Firestore document ID).
 *
 * Typically this is used when trying to retrieve a HikeEntity with a CompletedHike.
 *
 * @param {string} hikeId - The custom hikeId field inside the hike document.
 * @returns {Promise<HikeEntity|null>} The full hike object (including `id`), or null if not found.
 */
export const getHikeByHikeId = async (hikeId) => {
  try {
    const hikesRef = collection(db, "hikes");
    const q = query(hikesRef, where("hikeId", "==", hikeId), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`No hike found with hikeId: ${hikeId}`);
      return null;
    }

    const docSnap = snapshot.docs[0];
    return /** @type {HikeEntity} */ ({
      id: docSnap.id,
      ...docSnap.data(),
    });
  } catch (error) {
    console.error(`Failed to fetch hike by hikeId "${hikeId}":`, error);
    throw new Error("Error retrieving hike by hikeId");
  }
};

/**
 * Retrieves the title of a hike using the custom `hikeId` field (not the Firestore document ID).
 *
 * @param {string} hikeId - The custom hikeId field inside the hike document.
 * @returns {Promise<string|null>} The hike title, or null if not found.
 */
export const getHikeTitleByHikeId = async (hikeId) => {
  try {
    const hikesRef = collection(db, "hikes");
    const q = query(hikesRef, where("hikeId", "==", hikeId), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`No hike found with hikeId: ${hikeId}`);
      return null;
    }

    const hikeDoc = snapshot.docs[0];
    return hikeDoc.data().title ?? null;
  } catch (error) {
    console.error(`Failed to fetch hike title by hikeId ${hikeId}:`, error);
    throw new Error("Error retrieving hike title by hikeId");
  }
};

/**
 * Retrieves all hikes from Firestore as an array.
 *
 * Each returned hike includes its Firestore-generated `id` field along with the rest of the hike data.
 *
 * @returns {Promise<HikeEntity[]>} An array of hike objects.
 */
export const getAllHikes = async () => {
  const hikesRef = collection(db, "hikes");
  const snapshot = await getDocs(hikesRef);
  return snapshot.docs.map(
    (doc) => /** @type {HikeEntity} */ ({ id: doc.id, ...doc.data() })
  );
};

/**
 * Retrieves all hikes from Firestore and returns them as an object map,
 * using each hike's `hikeId` property as the key.
 *
 * Useful for fast lookup of hikes by `hikeId` instead of looping through an array.
 *
 * @returns Promise<Record<string, HikeEntity>> A map of hikes keyed by `hikeId`.
 */
export const getAllHikesAsMap = async () => {
  const hikesRef = collection(db, "hikes");
  const snapshot = await getDocs(hikesRef);

  const hikes = {};
  snapshot.forEach((doc) => {
    const data = doc.data();
    hikes[data.hikeId] = { id: doc.id, ...data };
  });

  return hikes;
};

/**
 * Updates an existing hike document in Firestore using the provided hikeId (which matches the Firestore doc ID).
 *
 * @param {string} hikeId - The Firestore document ID of the hike to update.
 * @param {Partial<HikeEntity>} updates - The fields to update on the hike.
 * @returns {Promise<void>}
 */
export const updateHike = async (hikeId, updates) => {
  const hikeRef = doc(db, "hikes", hikeId);
  await updateDoc(hikeRef, updates);
};

/**
 * Deletes a hike from Firestore using the `hikeId` field stored inside the document.
 *
 * Firestore document IDs are different from hikeId.
 * It will search the 'hikes' collection for a document where `hikeId` matches
 * and delete that document.
 *
 * @param {string} hikeId - The hike's unique internal ID (not the Firestore doc ID).
 * @returns {Promise<void>}
 */
export const deleteHikeByHikeId = async (hikeId) => {
  const hikesRef = collection(db, "hikes");
  const q = query(hikesRef, where("hikeId", "==", hikeId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error(`No hike found with hikeId: ${hikeId}`);
  }

  const docToDelete = snapshot.docs[0]; // assuming hikeId is unique
  await deleteDoc(doc(db, "hikes", docToDelete.id));
};

/**
 * Deletes a hike from Firestore using the explicit Firestore document ID (`docId`).
 *
 * This is useful when the document ID was auto-generated by Firestore and does not match the hikeId.
 *
 * @param {string} docId - The Firestore document ID to delete.
 * @returns {Promise<void>}
 */
export const deleteHikeByDocId = async (docId) => {
  const hikeRef = doc(db, "hikes", docId);
  await deleteDoc(hikeRef);
};

/**
 * Updates hike information including a new title, and ensures the new hikeId is unique.
 *
 * @param {string} docId - The Firestore document ID of the hike to update.
 * @param {Partial<HikeEntity>} updatedData - The updated hike fields (must include `title`)
 */
export const updateHikeWithNewTitle = async (docId, updatedData) => {
  if (!updatedData.title) {
    throw new Error("Title is required to update hikeId.");
  }

  const newHikeId = sluggify(updatedData.title);

  // Check if new hikeId already exists in a different document
  const hikesRef = collection(db, "hikes");
  const q = query(hikesRef, where("hikeId", "==", newHikeId));
  const snapshot = await getDocs(q);

  const isDuplicate = snapshot.docs.some((doc) => doc.id !== docId);

  if (isDuplicate) {
    throw new Error("Another hike with this title already exists.");
  }

  // Update the hike with new title and new hikeId
  const hikeRef = doc(db, "hikes", docId);
  await updateDoc(hikeRef, {
    ...updatedData,
    hikeId: newHikeId,
  });
};

/**
 * Updates all hikes in the collection to add a description field with Lorem Ipsum text.
 * @returns {Promise<number>} The number of documents updated
 */
export const addDescriptionFieldToAllHikes = async () => {
  try {
    // Get all hikes
    const hikes = await getAllHikes();
    console.log(`Found ${hikes.length} hikes to update`);

    let batch = writeBatch(db);
    let count = 0;
    let totalUpdated = 0;

    const loremIpsumText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Vivamus at turpis nec dui gravida facilisis. Nulla facilisi. Maecenas et metus semper, feugiat urna nec, pharetra nulla.";

    for (const hike of hikes) {
      // Skip if description already exists
      if (hike.description) {
        console.log(`Skipping hike ${hike.id}: description already exists`);
        continue;
      }

      // Get reference to the hike document
      const hikeRef = doc(db, "hikes", hike.id);

      // Add the description field
      batch.update(hikeRef, { description: loremIpsumText });

      count++;
      totalUpdated++;

      // Firestore has a limit of 500 operations per batch
      if (count >= 400) {
        await batch.commit();
        console.log(`Committed batch of ${count} updates`);
        batch = writeBatch(db);
        count = 0;
      }
    }

    // Commit any remaining updates
    if (count > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${count} updates`);
    }

    console.log(
      `Successfully updated ${totalUpdated} hikes with description field`
    );
    return totalUpdated;
  } catch (error) {
    console.error("Failed to update hikes with description field:", error);
    throw new Error("Failed to add description field to hikes");
  }
};

/**
 * Updates the status of a hike.
 *
 * @param {string} hikeId - The Firestore document ID of the hike.
 * @param {string} newStatus - The new status to set (e.g., "Open", "Closed").
 * @returns {Promise<boolean>} True if the update was successful, false otherwise.
 */
export const updateHikeStatus = async (hikeId, newStatus) => {
  try {
    const hikeRef = doc(db, "hikes", hikeId);
    await updateDoc(hikeRef, {
      status: newStatus,
    });
    return true;
  } catch (error) {
    console.error("Error updating hike status:", error);
    throw error;
  }
};
