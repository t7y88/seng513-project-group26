import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import {
  deleteFirestoreUserData,
  tryDeleteAuthAccount,
} from "../../firebase/services/userDeletionService";
import { useNavigate } from "react-router-dom";

/**
 * DeleteProfileButton Component
 *
 * Purpose:
 * - Allows deletion of either:
 *   1. The current user's account (when no props are passed)
 *   2. Any user account (when `targetUser` is provided by an admin)
 *
 * Features:
 * - Confirmation modal before deletion
 * - Optional support for Firebase Auth account deletion (if current user)
 * - Invokes Firestore document deletion regardless of auth type
 * - Redirects to home after deleting own account
 * - Styled consistently with generic buttons
 *
 * Props:
 * - targetUser (optional): UserProfile object to be deleted
 *   If not provided, defaults to `currentUser` from context
 */
const DeleteProfileButton = ({ targetUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // The user to delete: either the explicitly provided user or the logged-in user
  const userToDelete = targetUser || currentUser;

  // Determine if this is a self-deletion request
  const isSelf = currentUser?.uid === userToDelete?.id;

  if (!userToDelete) return null;

  // Open the modal
  const handleDeleteClick = () => setIsModalOpen(true);

  // Close the modal
  const closeModal = () => setIsModalOpen(false);

  // Confirm and execute deletion
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      // Step 1: Delete Firestore user document
      await deleteFirestoreUserData(userToDelete.id);

      // Step 2 (optional): Delete Firebase Auth account if deleting self
      if (isSelf) {
        const authDeleteResult = await tryDeleteAuthAccount(currentUser);

        if (authDeleteResult.success) {
          await logout();
          navigate("/");
        } else if (authDeleteResult.reason === "reauth") {
          alert("Please re-authenticate before deleting your account.");
        } else {
          alert("An error occurred while deleting your Firebase account.");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An unexpected error occurred while deleting the user.");
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  return (
    <div>
      {/* Trigger deletion modal */}
      <button
        className="generic-delete-button-active text-xs sm:text-sm md:text-base px-4 py-1"
        onClick={handleDeleteClick}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete User"}
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="bg-white p-6 rounded-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
            <p className="mb-4">
              Are you sure you want to permanently delete {" "}
              <span className="font-bold">@{userToDelete.username}</span>?<br />
              This action cannot be undone.
            </p>
            <div className="flex justify-between">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={closeModal}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteProfileButton;