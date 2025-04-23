


import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getHikeRatingStats } from "../../firebase/services/reviewService";

const RatingWidget = ({ hikeId }) => {
  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        setLoading(true);
        const stats = await getHikeRatingStats(hikeId);
        setRatingStats(stats);
      } catch (error) {
        console.error("Error fetching rating:", error);
      } finally {
        setLoading(false);
      }
    };

    if (hikeId) {
      fetchRating();
    }
  }, [hikeId]);

  const renderStars = () => {
    const stars = [];
    const rating = ratingStats.average;
    
    // Create 5 stars
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Filled star
        stars.push(
          <Star 
            key={i} 
            className="fill-black text-black" 
            size={20} 
          />
        );
      } else {
        // Outline star
        stars.push(
          <Star 
            key={i} 
            className="text-black" 
            size={20} 
          />
        );
      }
    }
    
    return stars;
  };

  if (loading) {
    return <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className="text-gray-300" size={20} />
      ))}
    </div>;
  }

  return (
    <div className="flex items-center">
      <div className="flex gap-1">
        {renderStars()}
      </div>
      {ratingStats.count > 0 && (
        <span className="text-sm text-gray-600 ml-2">
          ({ratingStats.count} {ratingStats.count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default RatingWidget;