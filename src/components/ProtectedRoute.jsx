/* eslint-disable no-unused-vars */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');

  // Redirect unauthenticated visitors to /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}