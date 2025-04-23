import { Plus } from "lucide-react";

const PlusButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition w-fit"
      aria-label="Log Hike"
    >
      <Plus size={18} />
      <span className="text-base font-medium">Log Hike</span>
    </button>
  );
};

export default PlusButton;
