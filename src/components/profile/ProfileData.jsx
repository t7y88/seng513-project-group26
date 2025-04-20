import React from "react";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function ProfileData({ userData }) {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile/edit', { state: { userData } });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
      {/* Profile Image Section */}
      <div className="flex justify-center">
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img
            src={userData.profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* User Details Section */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900">@{userData.username}</h2>
        <div className="mt-2 text-gray-600 space-y-1">
          <p>{userData.age} years old</p>
          <p>{userData.location}</p>
          <div className="flex justify-center items-center gap-2 md:justify-start">
            <p>
              {/* {userData.friends.map((friendUsername, index) => (
                <span key={index}>@{friendUsername} </span>
              ))} */}
              {userData.friends.length > 0 ? userData.friends.length + " friends" : "no friends yet"}
            </p>
          </div>
          <p>Member since {userData.memberSince}</p>
        </div>
      </div>

      {/* About Section */}
      <div className="text-center md:text-left">
        <h3 className="font-bold text-lg text-gray-900">About</h3>
        <p className="mt-2 text-gray-600">{userData.about}</p>
        <p className="mt-2 text-sm text-gray-500">{userData.description}</p>
        <div className="flex justify-center md:justify-end ">
          <button
            onClick={handleEditProfile}
            className="generic-button-active mt-2"
          >
            <FaPencil className="inline-block mr-1" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileData;