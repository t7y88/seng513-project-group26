/**
 * Converts a given string into a URL-friendly "slug" format.
 * 
 * This is primarily used to generate consistent and unique hike IDs
 * from hike titles by removing special characters and replacing spaces 
 * with hyphens. For example, "Lake Louise Trail!" becomes "lake-louise-trail".
 *
 * Steps performed:
 * - Converts all characters to lowercase
 * - Trims whitespace from the beginning and end
 * - Removes special characters (anything that's not a letter, number, underscore, or hyphen)
 * - Replaces one or more spaces with a single hyphen
 * 
 * @param {string} text - The original string (e.g. hike title) to convert.
 * @returns {string} A slugified version of the input string.
 *
 * @example
 * sluggify("Mount Yamnuska Trail!") // returns "mount-yamnuska-trail"
 */
export const sluggify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove special characters except spaces/hyphens/underscores
      .replace(/\s+/g, '-')     // replace all spaces with hyphens
  };
  