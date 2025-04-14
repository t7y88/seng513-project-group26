import { createUserInFirestore, addHike } from "./firestore";
import { sampleUsers } from "./stubs/sampleUsers";
import { hikeEntities } from "./stubs/hikeEntities";

// Utility function to delay for Firestore write limits (optional but safe)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const seedFirestore = async () => {
  try {
    console.log("Seeding hikes...");
    for (const hikeId in hikeEntities) {
      const hikeData = hikeEntities[hikeId];
      await addHike(hikeData);
      console.log(`Added hike: ${hikeData.title}`);
      await delay(100); // Small delay to avoid too many writes at once
    }

    console.log("Seeding users...");
    for (const user of sampleUsers) {
      const { username, ...userData } = user;
      await createUserInFirestore(username, userData);
      console.log(`Added user: ${username}`);
      await delay(100);
    }

    console.log("Firestore seeded successfully!");
  } catch (err) {
    console.error("Error seeding Firestore:", err);
  }
};

seedFirestore();
