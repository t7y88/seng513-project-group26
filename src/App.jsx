import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import NavBar from "./components/navbar/NavBar";
import BottomNavBar from "./components/navbar/BottomNavBar";

import Login from "./pages/authentication/login";
import Signup from "./pages/authentication/signup";
import Home from "./pages/home";
import Profile from "./pages/profile";
import EditProfilePage from "./pages/editProfile";
import Friends from "./pages/friends";
import FriendshipTester from "./components/admin/FriendshipTester";
import ProtectedRoute from "./components/ProtectedRoute";
import PageSizeWidget from "./components/PageSizeWidget";
import { UserDataProvider } from "./contexts/userDataContext";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => (
  <UserDataProvider>
    <Outlet />
  </UserDataProvider>
);

function App() {
  const { userLoggedIn } = useAuth();
  return (
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
            <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          </Route>

          <Route path="admin" element={<div>Admin Page Coming Soon</div>} />
          <Route path="admin/friendship" element={<FriendshipTester />} />
          <Route path="explore" element={<div>Explore Page Coming Soon</div>} />
        </Routes>

        <BottomNavBar />
        <PageSizeWidget />
      </div>
    </Router>
  );
}

export default App;