import { Plus } from "lucide-react";

const PlusButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-gray-100 transition"
      aria-label="Add hike"
    >
      <Plus className="w-6 h-6 stroke-gray-600" />
    </button>
  );
};

export default PlusButton;
