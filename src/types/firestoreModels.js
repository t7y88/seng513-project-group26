/**
 * @typedef {Object} CompletedHike
 * @property {string} id - Custom composite key for the document ID: `${userId}_${hikeId}_${dateCompleted}`
 * @property {string} userId - The Firestore document ID of the user who completed the hike.
 * @property {string} username - The username of the user who completed the hike.
 * @property {string} hikeId - The ID of the hike.
 * @property {number} rating - The rating given by the user (0–5).
 * @property {string} dateCompleted - The date the hike occurred (YYYY-MM-DD). If omitted, today's date will be used.
 * @property {number} timeToComplete - Actual time taken to complete the hike (in minutes)
 * @property {string} timeUnit - The unit of time for 'timeToComplete'
 * @property {string} [notes] - Optional notes or comments about the hike. 
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} WishlistedHike
 * @property {string} id - Composite key: `${userId}_${hikeId}`
 * @property {string} userId - The Firestore document ID of the user who wishlisted the hike.
 * @property {string} username - The username of the user who wishlisted the hike.
 * @property {string} hikeId - The ID of the hike.
 * @property {Date} createdAt - The timestamp of when the hike was wishlisted.
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} [id] - Firestore document ID (added during retrieval).
 * @property {string} email - The user's email address (copied from Firebase Auth at account creation).
 * @property {string} username - The unique username of the user.
 * @property {string} name - The full name of the user.
 * @property {number} age - Age of the user.
 * @property {string} location - City or region.
 * @property {string[]} friends - List of user IDs (UIDs) representing this user's friends.
 * @property {string} memberSince - Date the user joined (display string).
 * @property {string} about - Short bio.
 * @property {string} description - Longer, personal description.
 * @property {string} profileImage - URL to the user’s profile image.
 * @property {boolean} admin - Flag value. Indicates if the user is an admin.
 */

/**
 * @typedef {Object} HikeEntity
 * @property {string} [id] - Firestore document ID (added during retrieval).
 * @property {string} hikeId - Unique ID for the hike. (sluggified version of hike title)
 * @property {string} title - Name of the hike.
 * @property {string} image - Image URL.
 * @property {string} location - Geographic location.
 * @property {string} province - Province/State of hike location
 * @property {string} difficulty - Difficulty level (e.g. Easy, Moderate, Hard).
 * @property {number} distance - Distance in numeric form.
 * @property {string} distanceUnit - Unit of distance (e.g. "km").
 * @property {number} timeEstimateMinutes - Estimated time in minutes.
 * @property {number} elevation - Elevation gain (e.g. 763).
 * @property {string} elevationUnit - Unit of elevation gain (e.g. "m").
 * @property {string} [status] - (Optional) Trail status.
 */

/**
 * @typedef {Object} ReviewEntity
 * @property {string} [id] - Firestore document ID (added during retrieval).
 * @property {string} userId - The ID of the user who wrote the review.
 * @property {string} hikeId - The ID of the hike being reviewed.
 * @property {number} rating - The user's rating for the hike.
 * @property {string} [notes] - The written portion of the review.
 * @property {Date} [createdAt] - Timestamp when the review was submitted.
 */

/**
 * @typedef {Object} Friendship
 * @property {string} id - The unique ID of the friendship document.
 * @property {string} user1 - The ID of the first user in the friendship.
 * @property {string} user2 - The ID of the second user in the friendship.
 * @property {Date} since - The date the friendship was established.
 * @property {string} [status] - Optional status of the friendship (e.g., "accepted", "pending").
 */
