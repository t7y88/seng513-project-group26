import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import NavBar from "./components/NavBar";
import Home from "./pages/home";
import Login from "./pages/authentication/login";
import Signup from "./pages/authentication/signup";

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
    </Router>
  );
}

export default App;