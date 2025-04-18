import { useEffect, useState } from "react";
import ProfileData from "../components/profile/ProfileData";
import HikesList from "../components/profile/HikesList";
import { Link, useNavigate } from "react-router-dom";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext"; 
import { getCompletedHikes } from "../firebase/firestore"
import { getUserFromFirestore } from "../firebase/firestore"

// Mock data from stu
import { sampleUsers } from "../stubs/sampleUsers";
import { hikeEntities } from "../stubs/hikeEntities";


function Profile() {
  const navigate = useNavigate();
  
  
  // Pull user state from the auth context
  const { currentUser, loading } = useAuth();

  // Local state for Firestore data
  const [userData, setUserData] = useState(null);
  const [completedHikes, setCompletedHikes] = useState([]);

  // Once auth state is ready and user is authenticated, fetch their data
  useEffect(() => {
    if (loading || !currentUser) return;

    const fetchUser = async () => {
      try {
        console.log("Fetching user:", currentUser.uid);

        const user = await getUserFromFirestore(currentUser.uid);
        setUserData(user);

        const hikes = await getCompletedHikes(currentUser.uid);
        setCompletedHikes(hikes);
      } catch (err) {
        console.error("Error loading user or hikes from Firestore:", err);
      }
    };

    fetchUser();
  }, [currentUser, loading]);

  // Show loading UI while auth or data is not ready
  if (loading || !userData) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileData userData={userData} />
        
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
