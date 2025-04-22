// @ts-check
/// <reference path="../../types/firestoreModels.js" />

import { getAllHikes, getAllUsers } from "../index";

/**
 * Searches hikes by title with closest matches first
 * @param {string} searchTerm - The term to search for
 * @returns {Promise<HikeEntity[]>} Array of matching hikes
 */
export const searchHikes = async (searchTerm) => {
  try {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return [];

    // Get all hikes with proper typing
    const allHikes = await getAllHikes();

    // Filter and sort client-side
    const filteredHikes = allHikes.filter((hike) =>
      hike.title.toLowerCase().includes(term)
    );

    filteredHikes.sort((a, b) => {
      const aStartsWith = a.title.toLowerCase().startsWith(term);
      const bStartsWith = b.title.toLowerCase().startsWith(term);

      // Starts-with matches come first
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    });

    return filteredHikes;
  } catch (error) {
    console.error("Error searching hikes:", error);
    return [];
  }
};

/**
 * Searches users by name or username (excluding current user)
 * @param {string} searchTerm - The term to search for
 * @returns {Promise<UserProfile[]>} Array of matching users
 */
export const searchUsers = async (searchTerm) => {
  try {
    // Normalize search term
    const term = searchTerm.toLowerCase().trim();
    if (!term) return [];

    // Get all users with proper typing
    const allUsers = await getAllUsers();

    // Filter search matches (no longer excluding current user)
    const filteredUsers = allUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(term) ||
        (user.username && user.username.toLowerCase().includes(term))
      );
    });

    // Sort by best match
    filteredUsers.sort((a, b) => {
      const aNameStarts = a.name.toLowerCase().startsWith(term);
      const bNameStarts = b.name.toLowerCase().startsWith(term);
      const aUsernameStarts =
        a.username && a.username.toLowerCase().startsWith(term);
      const bUsernameStarts =
        b.username && b.username.toLowerCase().startsWith(term);

      // Prioritize name matches
      if (aNameStarts && !bNameStarts) return -1;
      if (!aNameStarts && bNameStarts) return 1;

      // Then prioritize username matches
      if (aUsernameStarts && !bUsernameStarts) return -1;
      if (!aUsernameStarts && bUsernameStarts) return 1;

      return 0;
    });

    return filteredUsers;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};
