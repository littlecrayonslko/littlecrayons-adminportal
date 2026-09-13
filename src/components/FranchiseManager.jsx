/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { franchiseApi } from '../api/services';

export default function FranchiseManager({ onBack }) {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', image: '' });

  const loadFranchises = async () => {
    try {
      setLoading(true);
      const data = await franchiseApi.getAll();
      setFranchises(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFranchises();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await franchiseApi.update(editingId, form);
      } else {
        await franchiseApi.create(form);
      }
      setForm({ title: '', body: '', image: '' });
      setEditingId(null);
      await loadFranchises();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this franchise entry?')) return;
    try {
      await franchiseApi.delete(id);
      setFranchises((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={onBack}>
        &larr; Back to Dashboard
      </button>

      <h3 className="fw-bold mb-4">Franchise Portal</h3>

      {/* Editor Form */}
      <div className="card shadow-sm border-0 p-4 mb-4 rounded-3">
        <h5 className="fw-bold mb-3">{editingId ? 'Edit Franchise' : 'Add New Franchise'}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              className="form-control"
              placeholder="Franchise Branch / Region Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Hero / Location Image URL</label>
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
            <label className="form-label fw-semibold">Body Content</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Franchise specifications, requirements, and notes..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary px-4" type="submit">
              {editingId ? 'Update Franchise' : 'Create Franchise'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: '', body: '', image: '' });
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
                <th>Title</th>
                <th>Description</th>
                <th className="text-end" style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {franchises.map((f) => {
                const id = f._id || f.id;
                return (
                  <tr key={id}>
                    <td>
                      <img
                        src={f.image}
                        alt={f.title}
                        className="rounded object-fit-cover"
                        style={{ width: 60, height: 45 }}
                      />
                    </td>
                    <td className="fw-semibold">{f.title}</td>
                    <td className="text-muted text-truncate" style={{ maxWidth: 280 }}>
                      {f.body}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          setEditingId(id);
                          setForm({ title: f.title, body: f.body, image: f.image });
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