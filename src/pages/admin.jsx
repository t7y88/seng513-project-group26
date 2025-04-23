import React, { useState } from "react";
import AdminUserList from "../components/admin/AdminUserList";
import UserSearchBar from "../components/navbar/UserSearchBar";
import { useUserData } from "../contexts/userDataContext/useUserData";

/**
 * Admin Page
 *
 * Purpose:
 * - Allows admins to browse and search the full list of users.
 * - Uses AdminUserList to render user information cards.
 * - Uses UserSearchBar to perform real-time Firestore search.
 */
function Admin() {
  const { userData, loading } = useUserData();

  // State to hold filtered user search results
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Loading indicator while user data is being fetched
  if (loading || !userData?.id) {
    return <div className="text-center py-10 text-gray-500">Fetching user data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* User Search Bar - updates AdminUserList below */}
        <UserSearchBar
          onSearchResults={setFilteredUsers}
          currentUserId={userData.id}
          placeholder="Search users"
        />

        {/* AdminUserList - displays results from search */}
        <AdminUserList users={filteredUsers} />
      </div>
    </div>
  );
}

export default Admin;
