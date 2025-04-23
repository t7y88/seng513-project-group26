import { Plus } from "lucide-react";



const PlusButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-xl hover:bg-black hover:text-white transition w-fit h-fit "
      aria-label="Add item"
    >
      <span className="text-xl">Log Hike</span>
    </button>
  );
};

export default PlusButton;
