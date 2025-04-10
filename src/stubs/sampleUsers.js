// NOTE: This mock user data includes personal details + recent hike references.
// The hikes reference shared hikeEntities by ID and include user-specific metadata.

export const sampleUsers = [
    {
        username: "usharabkhan",
        name: "Usharab Khan",
        age: 28,
        location: "Calgary, AB",
        friends: ["aidansloman", "kylewest"], // <- an array of actual usernames define the friends list
        memberSince: "January 2024",
        about: "Passionate hiker and nature enthusiast",
        description:
            "Always seeking new adventures in the Canadian Rockies. Love photographing wildlife and mountain landscapes.",
        profileImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9UdkG68P9AHESMfKJ-2Ybi9pfnqX1tqx3wQ&s",
        // This is how we will reference completed hikes in the database.
        // The hike ID will be used to fetch the actual hike data from the database, 
        // i.e. the firebase document will be keyed by hikeID
        // The metadata is user-specific and will be stored in the user document.
        completedHikes: [
            {
                hikeId: "valley-of-five-lakes",
                dateCompleted: "2025-04-06",
                rating: 4.5,
                notes: "Crystal-clear lakes and stunning reflections!"
            },
            {
                hikeId: "ha-ling-peak",
                dateCompleted: "2025-05-10",
                rating: 5,
                notes: "I almost got struck by lightning - but what a view!"
            },
            {
                hikeId: "valley-of-five-lakes",
                dateCompleted: "2022-04-16",
                rating: 3,
                notes: "Cold and Rainy - but the views were worth it!"
            },
            {
                hikeId: "ha-ling-peak",
                dateCompleted: "2022-06-10",
                rating: 4,
                notes: "A bit windy, but that meant the sky was blue and the sun was out."
            },
            {
                hikeId: "valley-of-five-lakes",
                dateCompleted: "2021-08-06",
                rating: 4,
                notes: "I saw a squirrel. It was brown."
            },
            {
                hikeId: "ha-ling-peak",
                dateCompleted: "2020-12-24",
                rating: 1,
                notes: "Why did I think this was a good idea? It was freezing!"
            },
            {
                hikeId: "valley-of-five-lakes",
                dateCompleted: "2019-06-06",
                rating: 5,
                notes: "The best hike ever! I saw a moose!"
            },
            {
                hikeId: "ha-ling-peak",
                dateCompleted: "2019-03-10",
                rating: 3.5,
                notes: "It snowed the whole time, and I almost slipped and died, but the view was worth it!"
            }
        
        ]
    },
    {
        username: "aidansloman",
        name: "Aidan Sloman",
        age: 72,
        location: "Calgary, AB",
        friends: ["usharabkhan"], // <- mutual friend
        memberSince: "April 30, 1993",
        about: "I was big into hiking just like you...until I took an arrow to the knee.",
        profileImage:
            "https://static1.srcdn.com/wordpress/wp-content/uploads/2022/04/skyrim-whiterun-guard-1.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5",
        completedHikes: [
            {
                hikeId: "throat-of-the-world",
                dateCompleted: "2011-11-10",
                rating: 0.5,
                notes: "Too many stairs, not enough benches."
            }
        ]
    }
];

