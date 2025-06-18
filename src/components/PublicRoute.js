
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;

  return user ? <Navigate to="/dashboard" /> : children;
}
