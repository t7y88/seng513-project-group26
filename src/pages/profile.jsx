import React, { useState } from "react";

function Profile() {
  const [activeView, setActiveView] = useState('past'); // 'past' or 'wishlist'

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
    // Add more hikes as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Row 1: Profile Info */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <img
                src={userData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">@{userData.username}</h2>
            <div className="mt-2 text-gray-600 space-y-1">
              <p>{userData.age} years old</p>
              <p>{userData.location}</p>
              <p>{userData.friends} friends</p>
              <p>Member since {userData.memberSince}</p>
            </div>
          </div>

          {/* About */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900">About</h3>
            <p className="mt-2 text-gray-600">{userData.about}</p>
            <p className="mt-2 text-sm text-gray-500">{userData.description}</p>
          </div>
        </div>

        {/* Hikes Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button
                 className={`transition-colors ${
                  activeView === 'past'
                    ? 'generic-button-active'
                    : 'generic-button-inactive'
                }`}
                onClick={() => setActiveView('past')}
              >
                Past Hikes
              </button>
              <button
                className={`transition-colors ${
                  activeView === 'wishlist'
                    ? 'generic-button-active'
                    : 'generic-button-inactive'
                }`}
                onClick={() => setActiveView('wishlist')}
              >
                Wishlist
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {activeView === 'past' ? (
              <div className="space-y-4">
                {completedHikes.map((hike, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-medium">{hike.name}</h4>
                        <p className="text-sm text-gray-600">{hike.location}</p>
                      </div>
                      <div className="text-gray-600">
                        <p>Completed: {hike.dateCompleted}</p>
                      </div>
                      <div className="text-gray-600">
                        <p>Time: {hike.timeCompleted}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{hike.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {completedHikes.length === 0 && (
                  <p className="text-gray-600">No past hikes recorded yet</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">Your saved hikes will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
