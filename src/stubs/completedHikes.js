export const completedHikes = [
  { // All Completed Hike id's are composite keys (firestore UID + hikdId + dateCompleted)
    // This ensure users can only have one hike per hikeId per day (makes avoiding duplicates easier)
    id: "WeogUluGfXcT1QmkrcJf3eyYOwL2_valley-of-five-lakes_2025-04-06",
    userId: "WeogUluGfXcT1QmkrcJf3eyYOwL2",
    username: "noshinzion",
    hikeId: "valley-of-five-lakes",
    rating: 4.5,
    dateCompleted: "2025-04-06",
    timeToComplete: 230,
    timeUnit: "m",
    notes: "Crystal-clear lakes and stunning reflections!",
    createdAt: new Date()
  },
  {
    id: "WeogUluGfXcT1QmkrcJf3eyYOwL2_johnston-canyon_2025-04-03",
    userId: "WeogUluGfXcT1QmkrcJf3eyYOwL2",
    username: "noshinzion",
    hikeId: "johnston-canyon",
    rating: 4.2,
    dateCompleted: "2025-04-03",
    timeToComplete: 110,
    timeUnit: "m",
    notes: "Loved the waterfalls—easy and scenic.",
    createdAt: new Date()
  },
  {
    id: "WeogUluGfXcT1QmkrcJf3eyYOwL2_johnston-canyon-2_2025-04-05",
    userId: "WeogUluGfXcT1QmkrcJf3eyYOwL2",
    username: "noshinzion",
    hikeId: "johnston-canyon-2",
    rating: 4.0,
    dateCompleted: "2025-04-05",
    timeToComplete: 185,
    timeUnit: "m",
    notes: "Great views at the upper falls!",
    createdAt: new Date()
  },
  {
    id: "WeogUluGfXcT1QmkrcJf3eyYOwL2_lake-louise-teahouse_2025-04-11",
    userId: "WeogUluGfXcT1QmkrcJf3eyYOwL2",
    username: "noshinzion",
    hikeId: "lake-louise-teahouse",
    rating: 4.5,
    dateCompleted: "2025-04-11",
    timeToComplete: 260,
    timeUnit: "m",
    notes: "The teahouse at the top is a must-do.",
    createdAt: new Date()
  },
  {
    id: "WeogUluGfXcT1QmkrcJf3eyYOwL2_lake-louise-teahouse-2_2025-04-12",
    userId: "WeogUluGfXcT1QmkrcJf3eyYOwL2",
    username: "noshinzion",
    hikeId: "lake-louise-teahouse-2",
    rating: 4.1,
    dateCompleted: "2025-04-12",
    timeToComplete: 305,
    timeUnit: "m",
    notes: "Tiring but worth it for the views.",
    createdAt: new Date()
  },
  {
    id: "WeogUluGfXcT1QmkrcJf3eyYOwL2_plain-of-six-glaciers_2025-04-13",
    userId: "WeogUluGfXcT1QmkrcJf3eyYOwL2",
    username: "noshinzion",
    hikeId: "plain-of-six-glaciers",
    rating: 4.8,
    dateCompleted: "2025-04-13",
    timeToComplete: 310,
    timeUnit: "m",
    notes: "Snowy and incredible. Bring snacks!",
    createdAt: new Date()
  },
  {
    id: "WeogUluGfXcT1QmkrcJf3eyYOwL2_plain-of-six-glaciers-2_2025-04-14",
    userId: "WeogUluGfXcT1QmkrcJf3eyYOwL2",
    username: "noshinzion",
    hikeId: "plain-of-six-glaciers-2",
    rating: 4.9,
    dateCompleted: "2025-04-14",
    timeToComplete: 420,
    timeUnit: "m",
    notes: "Extended version is next level. Bring layers.",
    createdAt: new Date()
  },  
  {
    id: "WeogUluGfXcT1QmkrcJf3eyYOwL2_ha-ling-peak_2025-04-10",
    userId: "WeogUluGfXcT1QmkrcJf3eyYOwL2",
    username: "noshinzion",
    hikeId: "ha-ling-peak",
    rating: 3.0,
    dateCompleted: "2025-04-10",
    timeToComplete: 465,
    timeUnit: "m",
    notes: "Decent trail but a bit crowded.",
    createdAt: new Date()
  },
  {
    id: "WeogUluGfXcT1QmkrcJf3eyYOwL2_throat-of-the-world_2025-04-12",
    userId: "WeogUluGfXcT1QmkrcJf3eyYOwL2",
    username: "noshinzion",
    hikeId: "throat-of-the-world",
    rating: 5,
    dateCompleted: "2025-04-12",
    timeToComplete: 230,
    timeUnit: "m",
    notes: "I'm pretty sure I saw a dragon!",
    createdAt: new Date()
  },
  {
    id: "vWpuRDRE97Ujept8qNMKWzqvv373_valley-of-five-lakes_2025-04-06",
    userId: "vWpuRDRE97Ujept8qNMKWzqvv373",
    username: "aidansloman",
    hikeId: "valley-of-five-lakes",
    rating: 3.5,
    dateCompleted: "2025-04-06",
    timeToComplete: 230,
    timeUnit: "m",
    notes: "A bit muddy, but the lakes were beautiful.",
    createdAt: new Date()
  },
  {
    id: "vWpuRDRE97Ujept8qNMKWzqvv373_ha-ling-peak_2025-04-10",
    userId: "vWpuRDRE97Ujept8qNMKWzqvv373",
    username: "aidansloman",
    hikeId: "ha-ling-peak",
    rating: 4.0,
    dateCompleted: "2025-04-10",
    timeToComplete: 592,
    timeUnit: "m",
    notes: "I almost got struck by lightning!",
    createdAt: new Date()
  },
  {
    id: "vWpuRDRE97Ujept8qNMKWzqvv373_johnston-canyon_2025-04-02",
    userId: "vWpuRDRE97Ujept8qNMKWzqvv373",
    username: "aidansloman",
    hikeId: "johnston-canyon",
    rating: 4.0,
    dateCompleted: "2025-04-02",
    timeToComplete: 115,
    timeUnit: "m",
    notes: "Easy and relaxing, perfect for a light hike day.",
    createdAt: new Date()
  },
  {
    id: "vWpuRDRE97Ujept8qNMKWzqvv373_johnston-canyon-2_2025-04-04",
    userId: "vWpuRDRE97Ujept8qNMKWzqvv373",
    username: "aidansloman",
    hikeId: "johnston-canyon-2",
    rating: 4.2,
    dateCompleted: "2025-04-04",
    timeToComplete: 190,
    timeUnit: "m",
    notes: "A bit crowded, but the upper falls were stunning.",
    createdAt: new Date()
  },
  {
    id: "vWpuRDRE97Ujept8qNMKWzqvv373_lake-louise-teahouse_2025-04-12",
    userId: "vWpuRDRE97Ujept8qNMKWzqvv373",
    username: "aidansloman",
    hikeId: "lake-louise-teahouse",
    rating: 4.8,
    dateCompleted: "2025-04-12",
    timeToComplete: 250,
    timeUnit: "m",
    notes: "Teahouse at the top was worth every step.",
    createdAt: new Date()
  },
  {
    id: "vWpuRDRE97Ujept8qNMKWzqvv373_lake-louise-teahouse-2_2025-04-13",
    userId: "vWpuRDRE97Ujept8qNMKWzqvv373",
    username: "aidansloman",
    hikeId: "lake-louise-teahouse-2",
    rating: 4.6,
    dateCompleted: "2025-04-13",
    timeToComplete: 310,
    timeUnit: "m",
    notes: "Longer than expected but views were unbeatable.",
    createdAt: new Date()
  },
  {
    id: "vWpuRDRE97Ujept8qNMKWzqvv373_plain-of-six-glaciers_2025-04-14",
    userId: "vWpuRDRE97Ujept8qNMKWzqvv373",
    username: "aidansloman",
    hikeId: "plain-of-six-glaciers",
    rating: 4.9,
    dateCompleted: "2025-04-14",
    timeToComplete: 295,
    timeUnit: "m",
    notes: "One of the best hikes I’ve done – bring poles!",
    createdAt: new Date()
  },
  {
    id: "vWpuRDRE97Ujept8qNMKWzqvv373_plain-of-six-glaciers-2_2025-04-15",
    userId: "vWpuRDRE97Ujept8qNMKWzqvv373",
    username: "aidansloman",
    hikeId: "plain-of-six-glaciers-2",
    rating: 5.0,
    dateCompleted: "2025-04-15",
    timeToComplete: 410,
    timeUnit: "m",
    notes: "Absolutely epic – snow-covered ridges and all.",
    createdAt: new Date()
  },  
  {
    id: "vWpuRDRE97Ujept8qNMKWzqvv373_throat-of-the-world_2025-04-12",
    userId: "vWpuRDRE97Ujept8qNMKWzqvv373",
    username: "aidansloman",
    hikeId: "throat-of-the-world",
    rating: 0.5,
    dateCompleted: "2025-04-12",
    timeToComplete: 666,
    timeUnit: "m",
    notes: "Too many stairs, not enough benches.",
    createdAt: new Date()
  }
];
