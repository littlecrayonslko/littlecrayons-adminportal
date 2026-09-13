/* eslint-disable no-unused-vars */
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Global Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm">
        <div className="container-fluid">
          <NavLink className="navbar-brand fw-bold" to="/dashboard">
            Admin Panel
          </NavLink>
          <div className="d-flex align-items-center gap-2">
            <NavLink className="btn btn-sm btn-outline-light" to="/dashboard">
              Dashboard
            </NavLink>
            <button className="btn btn-sm btn-danger ms-2" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dynamic Page Content */}
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
}