import React from "react";
import ProfileData from "../components/profile/ProfileData";
import HikesList from "../components/profile/HikesList";

// Mock data from stu
import { sampleUsers } from "../stubs/sampleUsers";
import { hikeEntities } from "../stubs/hikeEntities";

function Profile() {
  // Mock data
  const userData = sampleUsers[0];

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
