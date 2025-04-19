// utils/hikeCompletionUtils.js

/**
 * Normalize date to YYYY-MM-DD format.
 *
 *  Firebase does not do this implicitly, and since the date is used as part of our
 * unique docId generation, we must ensure consistency across all insertions.
 * 
 * @param {string | Date} date - A Date object or string that can be parsed by Date.
 * @returns {string} - Formatted date string (YYYY-MM-DD).
 * 
 * @author aidan
 */
export function normalizeDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Generate a unique document ID for hike completions.
   * Format: userId_hikeId_YYYY-MM-DD
   * 
   * Note: This enforces a single completed hike per day, per hike. i.e. a user can 
   * complete 500 different hikes if they want each day, but they cannot complete
   * 2 of the same hike each day.
   * 
   * @param {string} userId 
   * @param {string} hikeId 
   * @param {string | Date} dateCompleted 
   * @returns {string}
   * 
   * @author aidan
   */
  export function generateHikeDocId(userId, hikeId, dateCompleted) {
    const date = normalizeDate(dateCompleted);
    return `${userId}_${hikeId}_${date}`;
  }
  