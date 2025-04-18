import { createUserInFirestore, addHike, addReview } from "./firestore";
import { sampleUsers } from "../stubs/sampleUsers";
import { hikeEntities } from "../stubs/hikeEntities";
import { reviewEntities } from "../stubs/reviewEntities"; 
import { completedHikes } from "../stubs/completedHikes";

// Utility function to delay for Firestore write limits (optional but safe)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const seedFirestore = async () => {
  try {
    console.log("Seeding hikes...");
    for (const hikeId in hikeEntities) {
      const hikeData = hikeEntities[hikeId];
      await addHike(hikeData);
      console.log(`Added hike: ${hikeData.title}`);
      await delay(100);
    }

    console.log("Seeding users...");
    for (const user of sampleUsers) {
      const { username, ...userData } = user;
      await createUserInFirestore(username, userData);
      console.log(`Added user: ${username}`);
      await delay(100);
    }

    console.log("Seeding reviews...");
    for (const review of reviewEntities) {
      await addReview(review);
      console.log(`Added review for hike ${review.hikeId} by ${review.userId}`);
      await delay(100);
    }

    for (const completedHike of completedHikes) {
      
    }


    console.log("Firestore seeded successfully!");
  } catch (err) {
    console.error("Error seeding Firestore:", err);
  }
};

export { seedFirestore };
