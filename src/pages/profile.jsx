import { useEffect, useState } from "react";
import ProfileData from "../components/profile/ProfileData";
import HikesList from "../components/profile/HikesList";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext"; 
import { useUserData } from "../contexts/userDataContext/useUserData"; 

import { getCompletedHikes,
         getUserFromFirestore,
         getFriendship,
         acceptFriendship,
         removeFriendship,
         requestFriendship
                              } from "../firebase/"
import { getUserHikeWishlist } from "../firebase/firestoreUser";



function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const { currentUser } = useAuth();
  const { userData: currentUserData, completedHikes: currentUserHikes, loading: currentUserLoading } = useUserData();
  
  // State for viewed profile data
  const [profileData, setProfileData] = useState(null);
  const [profileHikes, setProfileHikes] = useState([]);
  const [wishlistHikes, setWishlistHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendshipStatus, setFriendshipStatus] = useState(null);

  // Reset state when userId changes
  useEffect(() => {
    setProfileData(null);
    setProfileHikes([]);
    setFriendshipStatus(null);
  }, [userId]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        // If no userId provided or it matches current user, show own profile
        if (!userId || userId === currentUser?.uid) {
          setProfileData(currentUserData);
          setProfileHikes(currentUserHikes);
          setWishlistHikes(await getUserHikeWishlist(currentUserData.id));
        } else {
          // Load other user's profile
          const userData = await getUserFromFirestore(userId);
          const userHikes = await getCompletedHikes(userId);
          setProfileData(userData);
          setProfileHikes(userHikes);
          setWishlistHikes(await getUserHikeWishlist(userData.id));
          
          // Check friendship status
          const friendship = await getFriendship(currentUser.uid, userId);
          setFriendshipStatus(friendship.length > 0 ? friendship[0] : null);
          console.log(friendship.length)
        }
        // setWishlistHikes(profileData.wishlist)
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
      } else if (friendshipStatus.status === "pending") {
        if (friendshipStatus.senderId === currentUser.uid) {
          // Cancel request
          await removeFriendship(friendshipStatus.id);
          setFriendshipStatus(null);
        } else {
          // Accept request
          await acceptFriendship(friendshipStatus.id);
          const friendship = await getFriendship(currentUser.uid, userId);
          setFriendshipStatus(friendship[0]);
        }
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = !userId || userId === currentUser?.uid;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <ProfileData 
          userData={profileData} 
          isOwnProfile={isOwnProfile}
          friendshipStatus={friendshipStatus}
          onFriendshipAction={handleFriendshipAction}
        />
        <HikesList 
          completedHikes={profileHikes} 
          hikeWishlist={wishlistHikes}
          isOwnProfile={isOwnProfile}
        /> 

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
