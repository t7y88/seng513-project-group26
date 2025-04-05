import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EditProfile({ userData: initialUserData }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: initialUserData?.username || '',
    age: initialUserData?.age || '',
    location: initialUserData?.location || '',
    about: initialUserData?.about || '',
    description: initialUserData?.description || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement the update logic with Firebase
    console.log('Updated user data:', userData);
    navigate('/profile');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={userData.username}
                    onChange={handleChange}
                    className="input-field"
                />
            </div>

            <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                </label>
                <input
                    type="number"
                    name="age"
                    id="age"
                    value={userData.age}
                    onChange={handleChange}
                    className="input-field"
                />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={userData.location}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                About
              </label>
              <input
                type="text"
                name="about"
                id="about"
                value={userData.about}
                onChange={handleChange}
                    className="input-field"
                />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={userData.description}
                onChange={handleChange}
                    className="input-field"
                />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="generic-button-inactive"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="generic-button-active"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;