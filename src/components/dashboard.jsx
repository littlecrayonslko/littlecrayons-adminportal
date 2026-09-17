/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login', { replace: true });
    }
  };

  const modules = [
    {
      id: 'blogs',
      title: 'Blog Manager',
      desc: 'Publish, edit articles, update headlines, or remove outdated posts.',
      icon: 'bi-journal-richtext',
      route: '/dashboard/blogs',
      badge: 'Articles & Content',
      gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    },
    {
      id: 'franchises',
      title: 'Franchise Portal',
      desc: 'Review partner applications, update branch contacts, or delete listings.',
      icon: 'bi-shop-window',
      route: '/dashboard/franchises',
      badge: 'Partners & Locations',
      gradient: 'linear-gradient(135deg, #059669, #10b981)',
    },
    {
      id: 'gallery',
      title: 'Media Gallery',
      desc: 'Upload high-res event banners, manage media feeds, and delete images.',
      icon: 'bi-images',
      route: '/dashboard/gallery',
      badge: 'Media Assets',
      gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
    },
  ];

  return (
    <div className="container py-5">
      {/* Top Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 pb-3 border-bottom gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Admin Console</h2>
          <p className="text-muted mb-0">Select an operational action to view, create, or update records.</p>
        </div>
        <button className="btn btn-outline-danger btn-sm px-4 py-2 rounded-3 fw-semibold shadow-sm" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Sign Out
        </button>
      </div>

      {/* Action Modules */}
      <div className="row g-4">
        {modules.map((m) => (
          <div key={m.id} className="col-12 col-md-4">
            <div
              className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column"
              style={{
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
              }}
            >
              {/* Header Badge & Icon */}
              <div
                className="p-4 text-white d-flex align-items-center justify-content-between"
                style={{ background: m.gradient }}
              >
                <span className="badge bg-white text-dark rounded-pill px-3 py-1 fw-semibold shadow-sm">
                  {m.badge}
                </span>
                <i className={`bi ${m.icon} fs-3`}></i>
              </div>

              {/* Body */}
              <div className="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">
                <div className="mb-4">
                  <h4 className="fw-bold text-dark mb-2">{m.title}</h4>
                  <p className="text-secondary small mb-0">{m.desc}</p>
                </div>

                {/* Direct Action Options */}
                <div className="d-flex flex-column gap-2 mt-auto">
                  {/* Action 1: Create New */}
                  <button
                    type="button"
                    className="btn btn-primary w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate(`${m.route}?action=create`)}
                  >
                    <i className="bi bi-plus-circle-fill"></i>
                    <span>Create New</span>
                  </button>

                  {/* Action 2: View / Update / Delete */}
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate(m.route)}
                  >
                    <i className="bi bi-gear-wide-connected"></i>
                    <span>Manage (View / Edit / Delete)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}