import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext/useAuth";  // Adjust import to your context location
import { deleteFirestoreUserData, tryDeleteAuthAccount } from "../../firebase/services/userDeletionService";
import { useNavigate } from "react-router-dom";

const DeleteProfileButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { currentUser, logout } = useAuth(); // Accessing currentUser directly from context
    const navigate = useNavigate();
  
    if (!currentUser) {
      return <p>You must be logged in to delete your profile.</p>; // If no current user, show message or hide button
    }
  
    const handleDeleteClick = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    const handleDeleteConfirm = async () => {
      setIsDeleting(true);
  
      try {
        // Step 1: Delete Firestore user data
        await deleteFirestoreUserData(currentUser.uid);
  
        // Step 2: Try deleting the Firebase Authentication account
        const authDeleteResult = await tryDeleteAuthAccount(currentUser);
  
        if (authDeleteResult.success) {
          // Log out the user and redirect to the homepage (or login page)
          await logout();
          navigate("/");  // Redirect to home or login page
        } else if (authDeleteResult.reason === "reauth") {
          alert("Please re-sign in to confirm your identity before deleting your account.");
        } else {
          alert("There was an error while deleting your account. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting user profile:", error);
        alert("An error occurred while deleting your account.");
      } finally {
        setIsDeleting(false);
        closeModal();
      }
    };
  
    return (
      <div>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Profile"}
        </button>
  
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div
              className="bg-white p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
              <h2 className="text-xl font-semibold mb-4">Delete Your Account</h2>
              <p className="mb-4">
                Deleting your account will permanently remove your ability to log in. Are you sure you want to delete your profile and all associated data?
              </p>
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  onClick={closeModal}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Profile"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default DeleteProfileButton;
  