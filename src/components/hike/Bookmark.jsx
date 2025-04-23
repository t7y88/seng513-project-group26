import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { 
  createWishlistedHike, 
  removeWishlistedHikeById, 
  getWishlistedHikeById 
} from "../../firebase/services/wishlistService";




const BookmarkButton = ({hikeId, userId, username}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if hike is already in wishlist when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId || !hikeId) return;
      
      try {
        const wishlistedHike = await getWishlistedHikeById(userId, hikeId);
        setBookmarked(!!wishlistedHike);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };
    
    checkWishlistStatus();
  }, [hikeId, userId]);

  const handleBookmarkClick = async () => {
    if (!userId || !username) {
      console.error("Please log in to bookmark hikes");
      return;
    }

    setIsLoading(true);
    
    try {
      if (!bookmarked) {
        // Add to wishlist
        const result = await createWishlistedHike(
          userId,
          username,
          hikeId
        );
        
        if (result.success) {
          setBookmarked(true);
          console.log(result.alreadyExists 
            ? "This hike is already in your wishlist" 
            : "Added to wishlist");
        }
      } else {
        // Remove from wishlist
        await removeWishlistedHikeById(userId,  hikeId);
        setBookmarked(false);
        console.log("Removed from wishlist");
      }
    } catch (error) {
      console.error("Bookmark action failed:", error);
      console.error(error.message || "Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmarkClick}
      disabled={isLoading}
      className={`px-2 py-1 rounded-xl  w-fit h-fit transition ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
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