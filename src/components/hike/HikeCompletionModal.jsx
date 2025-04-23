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
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Failed to log completed hike:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal">
      <h2>Log Hike Completion</h2>
      <div>
        <label>
          Time to Complete:
          <input
            type="number"
            value={timeToComplete}
            onChange={(e) => setTimeToComplete(Number(e.target.value))}
          />
        </label>
        <label>
          Time Unit:
          <select
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </label>
        <label>
          Rating:
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            max="5"
            min="0"
          />
        </label>
        <label>
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default HikeCompletionModal;
