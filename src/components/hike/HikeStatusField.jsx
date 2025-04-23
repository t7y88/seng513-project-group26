import React, { useState } from 'react';
import { updateHikeStatus } from '../../firebase/services/hikeService';

const HikeStatusField = ({ hikeId, initialStatus, isAdmin }) => {
  const [status, setStatus] = useState(initialStatus || 'Open');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (status === newStatus) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await updateHikeStatus(hikeId, newStatus);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating hike status:", error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  // Static display for regular users
  if (!isAdmin) {
    return (
      <div className="text-lg">
        <span className="font-bold">Status: </span>
        <span className={`${status === 'Open' ? 'text-green-600' : 'text-red-600'} font-medium`}>
          {status}
        </span>
      </div>
    );
  }

  // Editable field for admins
  return (
    <div className="text-lg">
      <span className="font-bold">Status: </span>
      
      {isEditing ? (
        <div className="inline-block">
          <select 
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isLoading}
            className="ml-1 px-2 py-1 border rounded bg-white"
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      ) : (
        <>
          <span className={`${status === 'Open' ? 'text-green-600' : 'text-red-600'} font-medium`}>
            {status}
          </span>
          <button 
            onClick={() => setIsEditing(true)} 
            className="ml-2 text-sm text-blue-500 underline"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default HikeStatusField;