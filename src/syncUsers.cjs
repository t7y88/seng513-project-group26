const admin = require("firebase-admin");
const path = require("path");

// Get the absolute path to the service account key
const serviceAccountPath = path.resolve(
  __dirname,
  "../firebaseServiceAccountKey.json"
);
const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

async function generateUniqueUsername(baseUsername) {
  let username = baseUsername;
  let counter = 0;
  let isUnique = false;

  while (!isUnique) {
    const currentUsername = counter === 0 ? username : `${username}${counter}`;

    // Check if username exists
    const usersWithUsername = await db
      .collection("users")
      .where("username", "==", currentUsername)
      .limit(1)
      .get();

    if (usersWithUsername.empty) {
      return currentUsername;
    }

    counter++;
  }
}

async function syncUsers() {
  console.log("Starting user synchronization...");

  try {
    // Get all authenticated users
    const listUsersResult = await auth.listUsers();
    const authUsers = listUsersResult.users;
    console.log(`Found ${authUsers.length} authenticated users`);

    // Process each user
    let createdCount = 0;

    for (const authUser of authUsers) {
      // Check if user exists in Firestore
      const userDoc = await db.collection("users").doc(authUser.uid).get();

      if (!userDoc.exists) {
        console.log(
          `Creating user document for ${
            authUser.email || "user with ID " + authUser.uid
          }`
        );
        const suggestedUsername =
          authUser.displayName || `user_${authUser.uid.substring(0, 5)}`;
        const username = await generateUniqueUsername(suggestedUsername);

        // Create default user object
        const defaultUserData = {
          email: authUser.email || "",
          username: username,
          name: authUser.displayName || "",
          age: 0,
          location: "Unknown",
          friends: [],
          memberSince: new Date().toLocaleDateString(),
          about: "",
          description: "",
          profileImage: authUser.photoURL || "",
        };

        // Create user document in Firestore
        await db.collection("users").doc(authUser.uid).set(defaultUserData);
        createdCount++;
      }
    }

    console.log(
      `Synchronization complete. Created ${createdCount} new user documents.`
    );
  } catch (error) {
    console.error("Error synchronizing users:", error);
  }
}

// Run the sync function
syncUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
