import { Plus } from "lucide-react";



const PlusButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-gray-100 transition"
      aria-label="Add hike"
    >
      <span className="text-xl">Log Hike</span>
    </button>
  );
};

export default PlusButton;
