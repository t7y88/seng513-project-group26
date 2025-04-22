import { useState } from "react";
import { Bookmark } from "lucide-react";

const BookmarkButton = ({ initiallyBookmarked = false, onToggle }) => {
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);

  const handleClick = () => {
    const newState = !bookmarked;
    setBookmarked(newState);
    onToggle?.(newState);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full hover:bg-gray-200 transition"
      aria-label="Bookmark this trail"
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
