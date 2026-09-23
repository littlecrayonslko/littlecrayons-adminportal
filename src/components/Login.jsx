/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Agar token pehle se stored hai toh seedha Dashboard bhej do
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter both ID/Email and Password.');
      return;
    }

    setLoading(true);

    try {
      const cleanId = identifier.trim();
      const cleanPassword = password.trim();

      // Backend ko exact wahi keys bhejo jo loginAdmin controller expect karta hai
      const response = await authApi.login({
        identifier: cleanId,
        id: cleanId,
        username: cleanId,
        email: cleanId,
        password: cleanPassword,
      });

      console.log('Login Response:', response);

      // Agar response me token mil gaya
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('isAuthenticated', 'true');
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        // Hard redirect use kar rahe hain taaki agar React Router route me issue ho tab bhi dashboard khul jaye
        window.location.href = '/dashboard';
      } else {
        setErrorMsg('Login succeeded but no token was returned by the server.');
      }
    } catch (err) {
      console.error('Login Error details:', err);
      setErrorMsg(err.message || 'Invalid Credentials or Server Down.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card shadow border-0 p-4 p-md-5 rounded-4" style={{ maxWidth: 420, width: '100%' }}>
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
            style={{ width: 54, height: 54, fontSize: '1.5rem' }}
          >
            <i className="bi bi-shield-lock"></i>
          </div>
          <h3 className="fw-bold text-dark">Admin Login</h3>
          <p className="text-muted small">Enter your credentials to continue</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 small rounded-3" role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">User ID / Username / Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-person text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Enter ID, Email or Username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-key text-muted"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0 ps-0"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className="btn btn-primary w-100 py-2 rounded-3 fw-semibold shadow-sm"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}