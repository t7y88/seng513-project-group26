import { useState } from "react";
import { createCompletedHike } from "../../firebase/services/completedHikeService";

const HikeCompletionModal = ({ hikeId, userId, onClose }) => {
  const [timeToComplete, setTimeToComplete] = useState(0);
  const [timeUnit, setTimeUnit] = useState("minutes");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const createdAt = new Date();

    const completedHikeData = {
      id: `completed-hike-${Date.now()}`,
      username: `user-${userId}`,
      hikeId,
      userId,
      rating: Number(rating),
      notes,
      dateCompleted: createdAt.toISOString(),
      timeToComplete: Number(timeToComplete),
      timeUnit,
      createdAt,
      createdAtts: {
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
      },
    };

    try {
      await createCompletedHike(completedHikeData);
      onClose();
    } catch (error) {
      console.error("Failed to log completed hike:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Log Hike Completion</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time to Complete</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={timeToComplete}
              onChange={(e) => setTimeToComplete(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Unit</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value)}
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
            <input
              type="number"
              max="5"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white transition ${
              isLoading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HikeCompletionModal;
