import { Plus } from "lucide-react";



const PlusButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-1 py-1 rounded-xl hover:bg-black hover:text-white transition w-fit h-fit flex-wrap"
      aria-label="Add item"
    >
      <span className="text-xl flex-wrap">Log Hike</span>
    </button>
  );
};

export default PlusButton;
