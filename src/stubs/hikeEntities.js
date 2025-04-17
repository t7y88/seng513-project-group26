// NOTE: This structure is intended to match the backend hike entity schema in Firebase.

export const hikeEntities = {
  "valley-of-five-lakes": {
    id: "valley-of-five-lakes",
    title: "Valley of Five Lakes",
    image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
    location: "Jasper National Park, Alberta",
    difficulty: "Moderate",
    distance: 4.5,
    distanceUnit: "km",
    timeEstimateMinutes: 150, // ~2.5 hours
    elevation: 66,
    elevationUnit: "m"
  },

  "ha-ling-peak": {
    id: "ha-ling-peak",
    title: "Ha Ling Peak",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ha-Ling-aerial.jpg/1920px-Ha-Ling-aerial.jpg",
    location: "Bow Valley Wildland Provincial Park, Alberta",
    difficulty: "Hard",
    distance: 7.4,
    distanceUnit: "km",
    timeEstimateMinutes: 210, // ~3.5 hours
    elevation: 763,
    elevationUnit: "m"
  },

  "throat-of-the-world": {
    id: "throat-of-the-world",
    title: "Throat of the World",
    image: "https://i0.wp.com/girlsincapes.com/wp-content/uploads/2014/11/Throat-of-the-World.jpg",
    location: "Skyrim",
    difficulty: "Hard",
    distance: 666,
    distanceUnit: "km",
    timeEstimateMinutes: 420, // ~7 hours
    elevation: 8848,
    elevationUnit: "m"
  }
};
