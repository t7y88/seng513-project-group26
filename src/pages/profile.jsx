import React from "react";
import ProfileData from "../components/profile/ProfileData";
import HikesList from "../components/profile/HikesList";

function Profile() {
  // Mock data
  const userData = {
    username: "usharabkhan",
    age: 28,
    location: "Calgary, AB",
    friends: 142,
    memberSince: "January 2024",
    about: "Passionate hiker and nature enthusiast",
    description: "Always seeking new adventures in the Canadian Rockies. Love photographing wildlife and mountain landscapes.",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9UdkG68P9AHESMfKJ-2Ybi9pfnqX1tqx3wQ&s",
  };

  const completedHikes = [
    {
      name: "Valley of Five Lakes",
      location: "Jasper National Park",
      dateCompleted: "March 15, 2025",
      timeCompleted: "2h 45min",
      rating: 4.5
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileData userData={userData} />
        <HikesList completedHikes={completedHikes} />
      </div>
    </div>
  );
}

export default Profile;
