import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import Home from "./pages/home";
import Login from "./pages/authentication/login";
import Signup from "./pages/authentication/signup";
import PageSizeWidget from "./components/PageSizeWidget";
import Profile from "./pages/profile";
import EditProfilePage from "./pages/editProfile";
import "./index.css";

function App() {
  const { userLoggedIn } = useAuth();
  return (
    <Router>
      <div className="pb-16 md:pb-0"> {/* Add padding for bottom nav */}
        <NavBar/>
        <Routes>
          <Route path="/" element={userLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="home" element={<Home />} />
          <Route path="explore" element={<div>Explore Page Coming Soon</div>} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          <Route path="friends" element={<div>Friends Page Coming Soon</div>} />
        </Routes>
        <BottomNavBar />
        {/* Widget for debug only. Helps us find the break points we want to set. */}
        <PageSizeWidget />
      </div>
    </Router>
  );
}

export default App;