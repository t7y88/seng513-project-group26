import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import { UserDataProvider } from "./contexts/userDataContext";
import NavBar from "./components/navbar/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import Home from "./pages/home";
import Login from "./pages/authentication/login";
import Signup from "./pages/authentication/signup";
import PageSizeWidget from "./components/PageSizeWidget";
import Profile from "./pages/profile";
import EditProfilePage from "./pages/editProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Map from "./components/Map";
import Friends from "./pages/friends";
import FriendshipTester from "./components/admin/FriendshipTester";
import "./index.css";

// Wrapper for protected routes — wraps them in UserDataProvider
const ProtectedLayout = () => (
  <UserDataProvider>
    <Outlet />
  </UserDataProvider>
);

function App() {
  const { userLoggedIn } = useAuth();
  return (
    <Router>
      {/* Shouldn't the bottom navbar just be the same component as the navbar 
          but it changes depending on the screen size?
          */}
      {/* Add padding for bottom nav */}
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
            <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          </Route>

          <Route path="admin" element={<div>Admin Page Coming Soon</div>} />
          {/* <Route 
            path="admin/friendship-tester" 
            element={
              <ProtectedRoute>
                <FriendshipTester />
              </ProtectedRoute>
            } 
          /> */}

          <Route path="admin/friendship" element={<FriendshipTester />} />
          <Route path="admin/friendship" element={<FriendshipTester />} />
          <Route path="explore" element={<div>Explore Page Coming Soon</div>} />
        </Routes>

        <BottomNavBar />
        {/* Widget for debug only. Helps us find the break points we want to set. */}
        <PageSizeWidget />
      </div>
    </Router>
  );
}

export default App;

