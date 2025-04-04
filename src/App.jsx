import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import NavBar from "./components/NavBar";
import Home from "./pages/home";
import Login from "./pages/authentication/login";
import Signup from "./pages/authentication/signup";
import PageSizeWidget from "./components/PageSizeWidget";
import "./index.css";

function App() {
  const { userLoggedIn } = useAuth();
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={userLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="login" element={<Login />}></Route>
        <Route path="signup" element={<Signup />}></Route>
        <Route path="home" element={<Home />}></Route>
      </Routes>
      {/* Widget for debug only. Helps us find the break points we want to set. */}
      <PageSizeWidget />
    </Router>
  );
}

export default App;