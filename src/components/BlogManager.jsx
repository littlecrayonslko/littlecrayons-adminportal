/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { blogApi } from '../api/services';

export default function BlogManager() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // 1. AUTH CHECK & INITIAL LOAD
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Agar user logged in nahi hai, seedha login page par redirect karo
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    loadBlogs();

    if (searchParams.get('action') === 'create' && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams, navigate]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogApi.getAll();
      const list = Array.isArray(res) ? res : res?.data || res?.blogs || [];
      setBlogs(list);
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMsg(err.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!imageFile) {
      setErrorMsg('Please select a cover image.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('body', body.trim());
      formData.append('image', imageFile);

      await blogApi.create(formData);

      setSuccessMsg('Blog post published successfully!');
      setTitle('');
      setBody('');
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await loadBlogs();
    } catch (err) {
      console.error('Create error:', err);
      setErrorMsg(err.message || 'Failed to publish blog post.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this blog post?')) return;

    try {
      await blogApi.delete(id);
      setBlogs((prev) => prev.filter((item) => item.id !== id));
      setSuccessMsg('Blog deleted successfully.');
    } catch (err) {
      alert(err.message || 'Failed to delete blog.');
    }
  };

  // Agar token exist nahi karta toh screen render hone se roko
  if (!localStorage.getItem('token')) {
    return null;
  }

  return (
    <div className="container py-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <button
            className="btn btn-outline-secondary btn-sm mb-2 d-inline-flex align-items-center gap-1"
            onClick={() => navigate('/dashboard')}
          >
            &larr; Back to Dashboard
          </button>
          <h3 className="fw-bold text-dark mb-0">Blog Manager</h3>
          <p className="text-muted small mb-0">Create new posts or remove existing entries.</p>
        </div>
        <button
          className="btn btn-primary btn-sm px-3 py-2 fw-semibold"
          onClick={() => {
            if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <i className="bi bi-plus-lg me-1"></i> New Post
        </button>
      </div>

      {/* Global Alerts */}
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
        <h5 className="fw-bold text-dark mb-3">Publish New Blog</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small">Post Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Activity Ideas for Early Childhood"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small">Cover Image (Required)</label>
            <input
              ref={fileInputRef}
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {imageFile && (
              <div className="small text-success mt-1">
                Selected: <strong>{imageFile.name}</strong> ({(imageFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary small">Article Body</label>
            <textarea
              className="form-control"
              rows={5}
              placeholder="Write the complete article content..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary px-4 py-2 fw-semibold" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Uploading & Publishing...
              </>
            ) : (
              'Publish Post'
            )}
          </button>
        </form>
      </div>

      {/* Blogs List */}
      <h5 className="fw-bold text-dark mb-3">Published Blogs ({blogs.length})</h5>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted small mt-2">Loading posts...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center py-5 text-muted">
          <p className="mb-0">No blogs published yet. Use the form above to add your first post.</p>
        </div>
      ) : (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 90 }}>Cover</th>
                  <th>Title</th>
                  <th className="d-none d-md-table-cell">Slug</th>
                  <th className="d-none d-sm-table-cell">Date</th>
                  <th className="text-end" style={{ width: 100 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <img
                        src={b.cover_image_url}
                        alt={b.title}
                        className="rounded-3 object-fit-cover border shadow-sm"
                        style={{ width: 64, height: 44 }}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x70?text=No+Img';
                        }}
                      />
                    </td>
                    <td>
                      <div className="fw-semibold text-dark text-break">{b.title}</div>
                      <div className="d-md-none text-muted small text-break">/{b.slug}</div>
                    </td>
                    <td className="d-none d-md-table-cell text-muted small text-break">
                      /{b.slug}
                    </td>
                    <td className="d-none d-sm-table-cell text-muted small">
                      {b.created_at ? new Date(b.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger fw-semibold"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </button>
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