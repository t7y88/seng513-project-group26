// src/components/admin/EditHikeForm.jsx
import React, { useState } from 'react';

const EditHikeForm = ({ hike, onSave }) => {
  const [formData, setFormData] = useState({ ...hike });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
      <input name="province" value={formData.province} onChange={handleChange} placeholder="Province" />
      <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" />
      <input name="difficulty" value={formData.difficulty} onChange={handleChange} placeholder="Difficulty" />
      <input name="distance" value={formData.distance} onChange={handleChange} placeholder="Distance" />
      <input name="distanceUnit" value={formData.distanceUnit} onChange={handleChange} placeholder="Distance Unit" />
      <input name="timeEstimateMinutes" value={formData.timeEstimateMinutes} onChange={handleChange} placeholder="Time Estimate (min)" />
      <input name="elevation" value={formData.elevation} onChange={handleChange} placeholder="Elevation" />
      <input name="elevationUnit" value={formData.elevationUnit} onChange={handleChange} placeholder="Elevation Unit" />

      <select name="status" value={formData.status} onChange={handleChange}>
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
