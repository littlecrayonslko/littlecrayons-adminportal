/* eslint-disable no-unused-vars */
// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/services'; // Make sure file name matches (service or services)

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginAction = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!id.trim() || !password.trim()) {
      setErrorMsg('Please enter both ID and Password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      console.log('Hitting login API...');
      const cleanId = id.trim();
      const cleanPassword = password.trim();

      const response = await authApi.login({
        id: cleanId,
        username: cleanId,
        email: cleanId,
        password: cleanPassword,
      });

      console.log('Login success response:', response);

      // Agar localStorage nahi chahiye, seedha redirect:
      navigate('/dashboard');
      
      // Fallback agar react router route match na kare:
      // window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login failed catch:', err);
      setErrorMsg(err.message || 'Invalid ID or Password');
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

        {/* onSubmit ko form se hata kar preventDefault diya hai */}
        <form onSubmit={(e) => { e.preventDefault(); handleLoginAction(e); }}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">User ID</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-person text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Enter your ID"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
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
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* type="button" kiya hai taaki default form submit trigger na ho sake */}
          <button
            className="btn btn-primary w-100 py-2 rounded-3 fw-semibold shadow-sm"
            type="button"
            disabled={loading}
            onClick={handleLoginAction}
          >
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}