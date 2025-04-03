import Signup from "./pages/authentication/signup";
import Login from "./pages/authentication/login";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; // Added Navigate import
import Home from "./pages/home";
import { useAuth } from "./contexts/authContext";

function App() {
  const { userLoggedIn } = useAuth();
  return (
    <Router>
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