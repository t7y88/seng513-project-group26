import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { updateUser } from '../../firebase/firestore';
import { uploadFile } from '../../firebase/storage';
import { useAuth } from '../../contexts/authContext';
import { useUserData } from '../../contexts/userDataContext';

function EditProfile({ userData: initialUserData }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { loading: userDataLoading } = useUserData();
  const [userData, setUserData] = useState({
    username: initialUserData?.username || '',
    age: initialUserData?.age || '',
    location: initialUserData?.location || '',
    about: initialUserData?.about || '',
    description: initialUserData?.description || '',
    profileImage: initialUserData?.profileImage || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadProgress('Uploading...');
      const fileName = `${currentUser.uid}-${Date.now()}-${file.name}`;
      const downloadURL = await uploadFile(file, `profile-images/${fileName}`);
      setUserData(prev => ({
        ...prev,
        profileImage: downloadURL
      }));
      setUploadProgress(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadProgress('Upload failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUser(currentUser.uid, userData);
      // Force reload the page to refresh the context
      window.location.href = '/profile';
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
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
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                {userData.profileImage ? 
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                : 
                  <FaUserCircle className="w-full h-full object-cover text-gray-400"/>
                }
              </div>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="profile-image-upload"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="profile-image-upload"
                  className="cursor-pointer generic-button-active block text-center"
                >
                  Choose Image
                </label>
                {uploadProgress && (
                  <p className="text-sm text-gray-600 text-center">{uploadProgress}</p>
                )}
                <p className="text-xs text-gray-500 text-center">
                  Or paste an image URL below
                </p>
                <input
                  type="url"
                  name="profileImage"
                  value={userData.profileImage}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className="input-field mt-1"
                  disabled={isSubmitting}
                />
              </div>
            </div>

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                About
              </label>
              <textarea
                name="about"
                id="about"
                rows={4}
                value={userData.about}
                onChange={handleChange}
                className="input-field"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="generic-button-inactive"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="generic-button-active"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;