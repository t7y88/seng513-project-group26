import { useEffect, useState } from "react";
import ProfileData from "../components/profile/ProfileData";
import HikesList from "../components/profile/HikesList";
import { Link, useNavigate } from "react-router-dom";
import { doSignOut } from "../firebase/auth";
// Context hooks for accessing user data
import { useAuth } from "../contexts/authContext"; 
import { useUserData } from "../contexts/userDataContext"; 

import { getCompletedHikes } from "../firebase/firestore"
import { getUserFromFirestore } from "../firebase/firestore"

// Mock data from stu
import { sampleUsers } from "../stubs/sampleUsers";
import { hikeEntities } from "../stubs/hikeEntities";


function Profile() {
  const navigate = useNavigate();
  const { userData, completedHikes, loading } = useUserData(); // shared user context


    // Logging to verify the data is loading
    console.log("[Profile] loading:", loading);
    console.log("[Profile] userData:", userData);
    console.log("[Profile] completedHikes:", completedHikes);

  if (loading || !userData) {
    console.log("[Profile] Still loading user data...");
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileData userData={userData} />
        <HikesList completedHikes = {completedHikes} /> 
        

        <div className="flex justify-center">
          <Link
            to="/login"
            className="md:hidden w-full text-center bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
              });
            }}
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}


export default Profile;
