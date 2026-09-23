/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { franchiseApi } from '../api/services';

export default function FranchiseManager({ onBack }) {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const file1Ref = useRef(null);
  const file2Ref = useRef(null);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    investment_budget: '',
    available_space_sqft: '',
    message: '',
  });

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  // 1. AUTH CHECK & INITIAL LOAD
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Token check: redirect if not authenticated
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    loadInquiries();
  }, [navigate]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  const loadInquiries = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await franchiseApi.getAll();
      const list = Array.isArray(res) ? res : res?.data || [];
      setInquiries(list);
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMsg(err.message || 'Failed to load franchise inquiries.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!image1 || !image2) {
      setErrorMsg('Both Property Image 1 and Image 2 are required.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();

      // Files MUST match the backend multer array key: 'images'
      payload.append('images', image1);
      payload.append('images', image2);

      payload.append('applicant_name', formData.applicant_name.trim());
      payload.append('email', formData.email.trim().toLowerCase());
      payload.append('phone', formData.phone.trim());
      payload.append('city', formData.city.trim());
      payload.append('state', formData.state.trim());
      payload.append('investment_budget', formData.investment_budget.trim());
      payload.append('available_space_sqft', formData.available_space_sqft.trim());

      if (formData.message && formData.message.trim()) {
        payload.append('message', formData.message.trim());
      }

      await franchiseApi.create(payload);

      setSuccessMsg('Franchise inquiry submitted successfully!');

      // Reset Form
      setFormData({
        applicant_name: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        investment_budget: '',
        available_space_sqft: '',
        message: '',
      });
      setImage1(null);
      setImage2(null);
      if (file1Ref.current) file1Ref.current.value = '';
      if (file2Ref.current) file2Ref.current.value = '';

      await loadInquiries();
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. FLASH SCREEN GUARD: Prevent component render before redirect completes
  if (!localStorage.getItem('token')) {
    return null;
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <button
            className="btn btn-outline-secondary btn-sm mb-2 d-inline-flex align-items-center gap-1"
            onClick={handleBack}
          >
            &larr; Back to Dashboard
          </button>
          <h3 className="fw-bold text-dark mb-0">Franchise Inquiry Portal</h3>
          <p className="text-muted small mb-0">Register partner applications and view incoming inquiries.</p>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show rounded-3" role="alert">
          {errorMsg}
          <button type="button" className="btn-close" onClick={() => setErrorMsg('')}></button>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show rounded-3" role="alert">
          {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* Form Card */}
      <div className="card shadow-sm border-0 p-3 p-md-4 mb-5 rounded-4" ref={formRef}>
        <h5 className="fw-bold text-dark mb-3">Submit Franchise Application</h5>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-secondary small">Applicant Name *</label>
              <input
                type="text"
                name="applicant_name"
                className="form-control"
                placeholder="Full Name"
                value={formData.applicant_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-secondary small">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-secondary small">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-secondary small">City *</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="e.g. Thane"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-secondary small">State *</label>
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="e.g. Maharashtra"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-secondary small">Investment Budget *</label>
              <input
                type="text"
                name="investment_budget"
                className="form-control"
                placeholder="e.g. 15-20 Lakhs"
                value={formData.investment_budget}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-secondary small">Available Space (Sq Ft) *</label>
              <input
                type="number"
                name="available_space_sqft"
                className="form-control"
                placeholder="e.g. 1200"
                value={formData.available_space_sqft}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* 2 Files Required */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold text-secondary small">Property Image 1 *</label>
              <input
                ref={file1Ref}
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImage1(e.target.files[0] || null)}
                required
              />
              {image1 && (
                <div className="small text-success mt-1">
                  Selected: {image1.name} ({(image1.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold text-secondary small">Property Image 2 *</label>
              <input
                ref={file2Ref}
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImage2(e.target.files[0] || null)}
                required
              />
              {image2 && (
                <div className="small text-success mt-1">
                  Selected: {image2.name} ({(image2.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary small">Message / Comments (Optional)</label>
            <textarea
              name="message"
              className="form-control"
              rows={3}
              placeholder="Additional property or commercial details..."
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>

          <button className="btn btn-primary px-4 py-2 fw-semibold" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Uploading Images & Saving...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      </div>

      {/* List Table */}
      <h5 className="fw-bold text-dark mb-3">All Inquiries ({inquiries.length})</h5>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted small mt-2">Loading applications...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center py-5 text-muted">
          <p className="mb-0">No franchise inquiries recorded yet.</p>
        </div>
      ) : (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Applicant</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Budget / Space</th>
                  <th>Property Photos</th>
                  <th className="d-none d-lg-table-cell">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td>
                      <div className="fw-semibold text-dark">{inq.applicant_name}</div>
                      {inq.message && (
                        <div className="small text-muted text-truncate" style={{ maxWidth: 220 }}>
                          {inq.message}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="small">{inq.email}</div>
                      <div className="small text-muted">{inq.phone}</div>
                    </td>
                    <td>
                      <div className="small">{inq.city}, {inq.state}</div>
                    </td>
                    <td>
                      <div className="small fw-semibold text-dark">{inq.investment_budget}</div>
                      <div className="small text-muted">{inq.available_space_sqft} sq ft</div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {inq.image_1_url && (
                          <a href={inq.image_1_url} target="_blank" rel="noreferrer">
                            <img
                              src={inq.image_1_url}
                              alt="Property 1"
                              className="rounded-2 border object-fit-cover shadow-sm"
                              style={{ width: 45, height: 35 }}
                            />
                          </a>
                        )}
                        {inq.image_2_url && (
                          <a href={inq.image_2_url} target="_blank" rel="noreferrer">
                            <img
                              src={inq.image_2_url}
                              alt="Property 2"
                              className="rounded-2 border object-fit-cover shadow-sm"
                              style={{ width: 45, height: 35 }}
                            />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="d-none d-lg-table-cell text-muted small">
                      {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}