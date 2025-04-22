// utils/wishlistUtils.js

/**
 * Generate a unique document ID for wishlisted hikes.
 * Format: userId_hikeId
 * 
 * This format ensures that each user can wishlist a specific hike only once.
 * It also allows easy overwrite/update when toggling wishlist status.
 * 
 * @param {string} userId - The user's unique ID.
 * @param {string} hikeId - The hike's unique ID.
 * @returns {string} - Unique wishlist document ID.
 * 
 * @author noshin
 */
export function generateWishlistDocId(userId, hikeId) {
    return `${userId}_${hikeId}`;
  }
    
  /**
   * Get the current timestamp for when a hike is wishlisted.
   * Used for ordering wishlisted hikes in reverse chronological order.
   * 
   * This function returns a Date object that can be converted to a Firebase
   * serverTimestamp when writing to the database.
   * 
   * @returns {Date} - Current date and time.
   * 
   * @author noshin
   */
  export function getWishlistTimestamp() {
    return new Date();
  }
  