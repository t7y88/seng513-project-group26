import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import this
import NavBar from "./components/navbar/NavBar";
import BottomNavBar from "./components/navbar/BottomNavBar";

import Login from "./pages/authentication/login";
import Signup from "./pages/authentication/signup";
import Home from "./pages/home";
import Profile from "./pages/profile";
import EditProfilePage from "./pages/editProfile";
import Friends from "./pages/friends";
import Admin from "./pages/admin";
import FriendshipTester from "./components/admin/FriendshipTester";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute.jsx";
import PageSizeWidget from "./components/PageSizeWidget";
import { UserDataProvider } from "./contexts/userDataContext";
import HikeInfo from "./components/hike/HikeInfo";
import "./index.css";

const ProtectedLayout = () => (
  <UserDataProvider>
    <Outlet />
  </UserDataProvider>
);

function App() {
  const { userLoggedIn } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; 
  return (
    <GoogleOAuthProvider clientId={clientId}> 
      <Router>
        <NavBar />
        <div className="pb-16 md:pb-0">
          <Routes>
            <Route
              path="/"
              element={
                userLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />

            {/* Protected routes grouped under UserDataProvider */}
            <Route element={<ProtectedLayout />}>
              <Route
                path="home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile/:userId"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="friends"
                element={
                  <ProtectedRoute>
                    <Friends />
                  </ProtectedRoute>
                }
              />
              {/* Admin-only routes */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/friendship"
                element={
                  <AdminRoute>
                    <FriendshipTester />
                  </AdminRoute>
                }
              />
              {/* Hike info page */}
              <Route
                path="/hike/:hikeId"
                element={

                    <HikeInfo />

                }
              />
            </Route>

            <Route path="explore" element={<div>Explore Page Coming Soon</div>} />
          </Routes>

          <BottomNavBar />
          <PageSizeWidget />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
