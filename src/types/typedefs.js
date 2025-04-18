/**
 * @typedef {Object} CompletedHike
 * @property {string} userId - The ID of the user who completed the hike.
 * @property {string} hikeId - The ID of the hike.
 * @property {number} rating - The rating given by the user (0–5).
 * @property {string} [notes] - Optional notes or comments about the hike.
 * @property {string} [dateCompleted] - The date the hike occurred (YYYY-MM-DD). If omitted, today's date will be used.
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} username - The unique username of the user.
 * @property {string} name - The full name of the user.
 * @property {number} age - Age of the user.
 * @property {string} location - City or region.
 * @property {string[]} friends - List of usernames the user is friends with.
 * @property {string} memberSince - Date the user joined (display string).
 * @property {string} about - Short bio.
 * @property {string} description - Longer, personal description.
 * @property {string} profileImage - URL to the user’s profile image.
 */

/**
 * @typedef {Object} HikeEntity
 * @property {string} id - Unique ID for the hike.
 * @property {string} title - Name of the hike.
 * @property {string} image - Image URL.
 * @property {string} location - Geographic location.
 * @property {string} difficulty - Difficulty level (e.g. Easy, Moderate, Hard).
 * @property {string} distance - Distance (e.g. "7.4 km").
 * @property {string} time - Estimated time (e.g. "~ 3-4 hours").
 * @property {string} elevation - Elevation gain (e.g. "763 m").
 */

/**
 * @typedef {Object} ReviewEntity
 * @property {string} userId - The ID of the user who wrote the review.
 * @property {string} hikeId - The ID of the hike being reviewed.
 * @property {number} rating - The user's rating for the hike.
 * @property {string} notes - The written portion of the review.
 * @property {Date} [createdAt] - Timestamp when the review was submitted.
 */
