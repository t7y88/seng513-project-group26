import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { createWishlistedHike, removeWishlistedHike } from "../../firebase/services/wishlistService";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-hot-toast";

const BookmarkButton = ({ hikeId }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Optional: Check if this hike is already bookmarked
    // For now, we'll just assume it's not bookmarked initially
  }, [hikeId, currentUser]);

  const handleClick = async () => {
    if (!currentUser) {
      toast.error("Please log in to bookmark hikes");
      return;
    }

    setIsLoading(true);
    
    try {
      if (!bookmarked) {
        const data = {
          userId: currentUser.uid,
          username: currentUser.username,
          hikeId: hikeId
        };

        // Add to wishlist
        const result = await createWishlistedHike(data);
        
        if (result.success) {
          setBookmarked(true);
          toast.success(result.alreadyExists 
            ? "This hike is already in your wishlist" 
            : "Added to wishlist");
        }
      } else {
        // Remove from wishlist
        
        await removeWishlistedHike({
          id: `${currentUser.uid}-${hikeId}`, // Generate a unique ID
          userId: currentUser.uid,
          username: currentUser.displayName || currentUser.email,
          createdAt: new Date().toISOString(), // Add a timestamp
          hikeId: hikeId
        });
        
        setBookmarked(false);
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      console.error("Bookmark action failed:", error);
      toast.error(error.message || "Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 rounded-full transition ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
      }`}
      aria-label={bookmarked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {bookmarked ? (
        <Bookmark className="fill-black" />
      ) : (
        <Bookmark className="text-gray-600" />
      )}
    </button>
  );
};

export default BookmarkButton;