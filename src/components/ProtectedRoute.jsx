import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

export default function ProtectedRoute({ children }) {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}