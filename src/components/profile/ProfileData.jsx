import React from "react";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function ProfileData({ userData, isOwnProfile, friendshipStatus, onFriendshipAction }) {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile/edit', { state: { userData } });
  };

  const getFriendshipButtonText = () => {
    if (!friendshipStatus) return "Add Friend";
    if (friendshipStatus.status === "pending") return "Cancel Request";
    return "Remove Friend";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
      {/* Profile Image Section */}
      <div className="flex justify-center">
        <div className="w-32 h-32 rounded-full overflow-hidden">
          {userData.profileImage ? 
            <img
              src={userData.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          : 
            <FaUserCircle className="w-full h-full object-cover"/>
          }
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
              {userData.friends.length > 0 ? userData.friends.length + " friends" : "no friends yet"}
            </p>
          </div>
          <p>Member since {userData.memberSince}</p>
        </div>
      </div>

      {/* Actions Section */}
      <div className="text-center md:text-left">
        <h3 className="font-bold text-lg text-gray-900">About</h3>
        <p className="mt-2 text-gray-600">{userData.about}</p>
        <p className="mt-2 text-sm text-gray-500">{userData.description}</p>
        <div className="flex justify-center md:justify-end mt-4 gap-2">
          {isOwnProfile ? (
            <button
              onClick={handleEditProfile}
              className="generic-button-active"
            >
              <FaPencil className="inline-block mr-1" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={onFriendshipAction}
              className={`generic-button-${friendshipStatus?.status === 'accepted' ? 'inactive' : 'active'}`}
            >
              {getFriendshipButtonText()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileData;