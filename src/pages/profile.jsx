import { useEffect, useState } from "react";
import ProfileData from "../components/profile/ProfileData";
import HikesList from "../components/profile/HikesList";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext"; 
import { useUserData } from "../contexts/userDataContext"; 
import { getCompletedHikes, getUserFromFirestore, getFriendship, requestFriendship, removeFriendship } from "../firebase/firestore";

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const { currentUser } = useAuth();
  const { userData: currentUserData, completedHikes: currentUserHikes, loading: currentUserLoading } = useUserData();
  
  // State for viewed profile data
  const [profileData, setProfileData] = useState(null);
  const [profileHikes, setProfileHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        // If no userId provided or it matches current user, show own profile
        if (!userId || userId === currentUser?.uid) {
          setProfileData(currentUserData);
          setProfileHikes(currentUserHikes);
        } else {
          // Load other user's profile
          const userData = await getUserFromFirestore(userId);
          const userHikes = await getCompletedHikes(userId);
          setProfileData(userData);
          setProfileHikes(userHikes);
          
          // Check friendship status
          const friendship = await getFriendship(currentUser.uid, userId);
          setFriendshipStatus(friendship.length > 0 ? friendship[0] : null);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!currentUserLoading) {
      loadProfileData();
    }
  }, [userId, currentUser, currentUserData, currentUserHikes, currentUserLoading]);

  const handleFriendshipAction = async () => {
    try {
      if (!friendshipStatus) {
        // Send friend request
        await requestFriendship(currentUser.uid, userId);
        const friendship = await getFriendship(currentUser.uid, userId);
        setFriendshipStatus(friendship[0]);
      } else {
        // Remove friendship
        await removeFriendship(friendshipStatus.id);
        setFriendshipStatus(null);
      }
    } catch (error) {
      console.error("Error managing friendship:", error);
    }
  };

  if (loading || !profileData) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  const isOwnProfile = !userId || userId === currentUser?.uid;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileData 
          userData={profileData} 
          isOwnProfile={isOwnProfile}
          friendshipStatus={friendshipStatus}
          onFriendshipAction={handleFriendshipAction}
        />
        <HikesList completedHikes={profileHikes} /> 

        {isOwnProfile && (
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
        )}
      </div>
    </div>
  );
}

export default Profile;
