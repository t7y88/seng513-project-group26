import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
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
import { Outlet } from "react-router-dom";
import "./index.css";
import HikeInfo from "./components/hike/HikeInfo";

const ProtectedLayout = () => (
  <UserDataProvider>
    <Outlet />
  </UserDataProvider>
);

function App() {
  const { userLoggedIn } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; 
  return (
    <GoogleOAuthProvider clientId = {clientId}> 
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
  
            <Route path="/hike/:hikeId" element={
              <ProtectedRoute>
                <HikeInfo />
              </ProtectedRoute>
            }/>
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

          </Route>
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

              {/* Supposed to be moved to clicking the cards on home */}
              <Route
                path="/hike/:hikeId"
                element={<HikeInfo hikeId={useParams().hikeId} />}
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
            </Route>

            <Route path="explore" element={<div>Explore Page Coming Soon</div>} />
          </Routes>

          <BottomNavBar />
          <PageSizeWidget />
        </div>
      </Router>
    </GoogleOAuthProvider> // Closing the provider here
  );
}

export default App;
