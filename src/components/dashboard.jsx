/* eslint-disable no-unused-vars */
import React from 'react';

export default function Dashboard({ onNavigate, onLogout }) {
  const cards = [
    {
      id: 'blogs',
      title: 'Blog Manager',
      desc: 'Publish and curate articles with headers, bodies, and hero images.',
      icon: 'bi-newspaper',
      badge: 'Articles & News',
      gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    },
    {
      id: 'franchises',
      title: 'Franchise Portal',
      desc: 'Control partner locations, details, descriptions, and media.',
      icon: 'bi-shop',
      badge: 'Locations & Partners',
      gradient: 'linear-gradient(135deg, #059669, #10b981)',
    },
    {
      id: 'gallery',
      title: 'Media Gallery',
      desc: 'High-res image assets, showcases, and media feed operations.',
      icon: 'bi-images',
      badge: 'Visual Assets',
      gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
    },
  ];

  return (
    <div className="container py-5">
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Admin Console</h2>
          <p className="text-muted mb-0">Select an operational module below to manage content.</p>
        </div>
        <button className="btn btn-outline-danger btn-sm px-3" onClick={onLogout}>
          Sign Out
        </button>
      </div>

      {/* 3 Core Interactive Action Cards */}
      <div className="row g-4">
        {cards.map((c) => (
          <div key={c.id} className="col-12 col-md-4">
            <div
              className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative"
              style={{
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
              onClick={() => onNavigate(c.id)}
            >
              <div
                className="p-4 text-white d-flex align-items-center justify-content-between"
                style={{ background: c.gradient }}
              >
                <span className="badge bg-white text-dark rounded-pill px-3 py-1 fw-semibold">
                  {c.badge}
                </span>
              </div>

              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <h4 className="fw-bold text-dark mb-2">{c.title}</h4>
                  <p className="text-secondary small mb-4">{c.desc}</p>
                </div>
                <button
                  className="btn btn-dark w-100 py-2 rounded-3 fw-semibold"
                  onClick={() => onNavigate(c.id)}
                >
                  Launch Manager &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}