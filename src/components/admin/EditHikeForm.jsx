// src/components/admin/EditHikeForm.jsx
import React, { useState, useEffect } from 'react';
import { updateHike } from '../../firebase/services/hikeService';

const EditHikeForm = ({ hike, onSave }) => {
  const [formData, setFormData] = useState({ ...hike });

  // Update the formData state when the hike prop changes
  useEffect(() => {
    setFormData({ ...hike });
  }, [hike]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the updateHike function to update the hike in Firestore
      await updateHike(hike.id, formData); // Assuming `hike.id` is the Firestore document ID
      onSave(formData); // Optionally, call onSave to handle success in the parent component
      alert('Hike updated successfully!');
    } catch (error) {
      console.error('Error updating hike:', error);
      alert('Failed to update hike. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
      />
      <input
        name="province"
        value={formData.province}
        onChange={handleChange}
        placeholder="Province"
      />
      <input
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <input
        name="difficulty"
        value={formData.difficulty}
        onChange={handleChange}
        placeholder="Difficulty"
      />
      <input
        name="distance"
        value={formData.distance}
        onChange={handleChange}
        placeholder="Distance"
      />
      <input
        name="distanceUnit"
        value={formData.distanceUnit}
        onChange={handleChange}
        placeholder="Distance Unit"
      />
      <input
        name="timeEstimateMinutes"
        value={formData.timeEstimateMinutes}
        onChange={handleChange}
        placeholder="Time Estimate (min)"
      />
      <input
        name="elevation"
        value={formData.elevation}
        onChange={handleChange}
        placeholder="Elevation"
      />
      <input
        name="elevationUnit"
        value={formData.elevationUnit}
        onChange={handleChange}
        placeholder="Elevation Unit"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="open">Open</option>
        <option value="closed for winter">Closed for Winter</option>
        <option value="bear in area">Bear in Area</option>
        <option value="under repair">Under Repair</option>
      </select>

      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditHikeForm;
