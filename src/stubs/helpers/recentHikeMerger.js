// Merges user-specific recentHikes with full hike data from hikeEntities


/*
This function takes two parameters: 
- completedHikes: an array of objects, each containing a hikeId and user-specific metadata (dateCompleted, rating, notes).
- hikeEntities: an array of objects that each contain hikeId and other hike details (title, location, image) etc.
                    hikeID is unique, so that is how we join a users list of completed hikes with the full hike data.

recentHikes: [
        {
          hikeId: "valley-of-five-lakes",
          dateCompleted: "2025-04-06",
          rating: 4.5,
          notes: "Crystal-clear lakes and stunning reflections!"
        }
*/

export function getMergedRecentHikes(completedHikes, hikeEntities) {
  if (!Array.isArray(completedHikes)) {
    console.warn("getMergedRecentHikes called with non-array:", completedHikes);
    return [];
  }

  return completedHikes.map((entry) => {
    const hike = hikeEntities[entry.hikeId] || {};
    //console.log("Friend Completed Hike -> docId: " + hike.docId + " | title: " + hike.title + " | hikeId: " + hike.hikeId)
    return {
      ...hike,
      ...entry
    };
  });
}



  