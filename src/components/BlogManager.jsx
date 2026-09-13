/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { blogApi } from '../api/services';

export default function BlogManager({ onBack }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ header: '', body: '', image: '' });

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogApi.getAll();
      setBlogs(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await blogApi.update(editingId, form);
      } else {
        await blogApi.create(form);
      }
      setForm({ header: '', body: '', image: '' });
      setEditingId(null);
      await loadBlogs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await blogApi.delete(id);
      setBlogs((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container py-4">
      <button className="btn btn-link text-decoration-none p-0 mb-3" onClick={onBack}>
        &larr; Back to Dashboard
      </button>

      <h3 className="fw-bold mb-4">Blog Manager</h3>

      {/* Editor Form */}
      <div className="card shadow-sm border-0 p-4 mb-4 rounded-3">
        <h5 className="fw-bold mb-3">{editingId ? 'Edit Blog' : 'Create New Blog'}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Header</label>
            <input
              className="form-control"
              placeholder="Post title / header"
              value={form.header}
              onChange={(e) => setForm({ ...form, header: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Hero Image URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Body</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Full article content..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary px-4" type="submit">
              {editingId ? 'Update Post' : 'Publish Post'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm({ header: '', body: '', image: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Item List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 80 }}>Image</th>
                <th>Header</th>
                <th>Body Preview</th>
                <th className="text-end" style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => {
                const id = b._id || b.id;
                return (
                  <tr key={id}>
                    <td>
                      <img
                        src={b.image}
                        alt={b.header}
                        className="rounded object-fit-cover"
                        style={{ width: 60, height: 45 }}
                      />
                    </td>
                    <td className="fw-semibold">{b.header}</td>
                    <td className="text-muted text-truncate" style={{ maxWidth: 280 }}>
                      {b.body}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          setEditingId(id);
                          setForm({ header: b.header, body: b.body, image: b.image });
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}