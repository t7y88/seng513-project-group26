import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import NavBar from "./components/navbar/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import Home from "./pages/home";
import Login from "./pages/authentication/login";
import Signup from "./pages/authentication/signup";
import PageSizeWidget from "./components/PageSizeWidget";
import Profile from "./pages/profile";
import EditProfilePage from "./pages/editProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

function App() {
  const { userLoggedIn } = useAuth();
  return (
    <Router>
      {/* Shouldn't the bottom navbar just be the same component as the navbar 
          but it changes depending on the screen size?
          */}
      <div className="pb-16 md:pb-0"> {/* Add padding for bottom nav */}
        <NavBar/>
        <Routes>
          <Route path="/" element={userLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="home" element={<Home />} />
          <Route path="explore" element={<div>Explore Page Coming Soon</div>} />
          <Route 
            path="profile" 
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
                <div>Friends Page Coming Soon</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
        <BottomNavBar />
        {/* Widget for debug only. Helps us find the break points we want to set. */}
        <PageSizeWidget />
      </div>
    </Router>
  );
}

export default App;