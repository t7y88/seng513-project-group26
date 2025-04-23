import React from "react";
import UserCard from "./UserCard";
import "../../index.css";

/**
 * AdminUserList Component
 *
 * Props:
 * - users: an array of user profile objects (search results only).
 *
 * This component does not render anything unless users are provided.
 */
function AdminUserList({ users }) {
  // Show nothing until a search is performed
  if (!users || users.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm">
        Start typing to search for users.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <UserCard
          key={user.id || index}
          regUser={user}
        />
      ))}
    </div>
  );
}

export default AdminUserList;
