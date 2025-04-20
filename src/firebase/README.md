# Firebase Setup Guide

This folder contains all Firebase-related configuration for the project. Here's what each file is for and how to work with them.

---

## Files & Their Purpose

- `firebase.json`: Firebase project configuration (deploy targets, emulator settings, etc.).
- `.firebaserc`: Tracks which Firebase project this repo is connected to.
- `firestore.rules`: Defines security rules for the Firestore database.
- `firestore.indexes.json`: Stores composite indexes used to support advanced Firestore queries.

---

## Project Info

This project is connected to:
**Project ID:** `seng513-project-group26`
**Firebase Console:** [Open Console](https://console.firebase.google.com/project/seng513-project-group26)

---

## Firebase CLI Setup

### Install Firebase CLI (if you haven't already):
```bash
npm install -g firebase-tools
```

### Log in to Firebase:
```bash
firebase login
```

---

## Deploying Rules and Indexes

To deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

To deploy Firestore indexes:
```bash
firebase deploy --only firestore:indexes
```

---

## Firestore Security Rules

Firestore rules are defined in `firestore.rules`. The current setup provides:

- **Open read/write access to all documents until May 17, 2025** (grace period).
- **Stricter rules for specific collections**, including:
  - `/users/{userId}` – readable/writable only by the authenticated user or admins.
  - `/completedHikes/{docId}` – user-scoped access based on document ID prefix.
  - `/reviews/{reviewId}` – public reads, but only the author can write.
  - `/hikes/{hikeId}` – public read-only.

### Example user-specific rule:
```js
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

After editing your rules, you must deploy them with:

 - firebase deploy --only firestore:rules



---

## Index Overview

These composite indexes are required for optimized queries:

| Collection        | Indexed Fields                 | Purpose                                                  |
|-------------------|-------------------------------|----------------------------------------------------------|
| `completedHikes` | `userId`, `dateCompleted`     | Query a user’s hikes sorted by most recent               |
| `reviews`         | `hikeId`, `createdAt`          | Retrieve reviews for a hike, sorted by newest first       |

You can modify or expand these in `firestore.indexes.json`. Firebase does not support inline comments in JSON, but comments are included using `_comment` fields for clarity.

---

## Authentication Notes

- Firebase Auth is used for user login
- Each user is identified by a unique `uid` (provided by Firebase)
- User data in Firestore is stored in `/users/{uid}`
- Do **not** use `username` as a primary key

---

## Questions or Debugging

If something doesn’t work, make sure:
- You are logged in via `firebase login`
- Your CLI is using the right project: `firebase use`
- Firestore has been initialized in the Firebase Console


---

## Emulators

We are using Firebase Emulators to test safely without inserting erroneous or broken records into our data set

Start the emulator:

- firebase emulators:start

Emulator Ports:

- Firestore: localhost:8080

- Emulator UI: localhost:4000

Usage in code (automatically connects in dev):

if (import.meta.env.MODE === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

All reads/writes will go to the local emulator in development mode, so it’s safe to experiment

---

## For TA's and Prof

This README documents the Firebase setup for our SENG 513 - 'WildRoutes' - group project. All files in this folder support development and deployment of our Firestore backend, including user data, hike tracking, and review management.

If anything looks misconfigured, check this README first.

