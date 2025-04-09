import React from "react";
import HikesList from "../components/profile/HikesList";
import ProfileData from "../components/profile/ProfileData";
import FriendsList from "../components/friends/FriendsList";


function Friends() {
    // Mock data
  const friendData1 = {
    username: "usharabkhan",
    name: "Usharab Khan",
    age: 28,
    location: "Calgary, AB",
    friends: 142,
    memberSince: "January 2024",
    about: "Passionate hiker and nature enthusiast",
    description: "Always seeking new adventures in the Canadian Rockies. Love photographing wildlife and mountain landscapes.",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9UdkG68P9AHESMfKJ-2Ybi9pfnqX1tqx3wQ&s",
  };

  const friendData2 = {
    username: "aidansloman",
    name: "Aidan Sloman",
    age: 72,
    location: "Calgary, AB",
    friends: 1,
    memberSince: "April 30, 1993",
    about: "I was big into hiking just like you...until I took an arrow to the knee.",
    profileImage: "https://static1.srcdn.com/wordpress/wp-content/uploads/2022/04/skyrim-whiterun-guard-1.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5",
  };

  const completedHikes1 = [
    {
      name: "Valley of Five Lakes",
      location: "Jasper National Park",
      dateCompleted: "March 15, 2025",
      timeCompleted: "2h 45min",
      rating: 4.5
    },
  ];
  
  const completedHikes2= [
    {
      name: "Throat of the World",
      location: "Skyrim",
      dateCompleted: "November 10, 2011",
      timeCompleted: "2h 45min",
      rating: 1.2
    },
  ];


  // This is just a stub, but ideally this would be replaced with a call to the database to get the friends of the user.
  // const friends = getFriendsFromDatabase(userId); // Replace with actual data fetching logic
  const friendsProp =  [friendData1, friendData2];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
      <FriendsList friends={friendsProp} />
      </div>
    </div>
  );
}

export default Friends;