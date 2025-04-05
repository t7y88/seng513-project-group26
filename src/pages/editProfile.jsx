import React from "react";
import EditProfile from "../components/profile/EditProfile";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

function EditProfilePage() {
  const { userLoggedIn } = useAuth();
  const location = useLocation();
  const userData = location.state?.userData;

  if (!userLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  if (!userData) {
    return <Navigate to="/profile" replace={true} />;
  }

  return <EditProfile userData={userData} />;
}

export default EditProfilePage;