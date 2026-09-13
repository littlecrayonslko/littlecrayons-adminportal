/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { galleryApi } from '../api/services';

export default function GalleryManager({ onBack }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryApi.getAll();
      setImages(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await galleryApi.update(editingId, { image: imageUrl });
      } else {
        await galleryApi.create({ image: imageUrl });
      }
      setImageUrl('');
      setEditingId(null);
      await loadGallery();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await galleryApi.delete(id);
      setImages((prev) => prev.filter((img) => (img._id || img.id) !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container py-4">
      <button className="btn btn-link text-decoration-none p-0 mb-3" onClick={onBack}>
        &larr; Back to Dashboard
      </button>

      <h3 className="fw-bold mb-4">Gallery Manager</h3>

      {/* Input Form */}
      <div className="card shadow-sm border-0 p-4 mb-4 rounded-3">
        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <input
            type="url"
            className="form-control"
            placeholder="Enter image URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
          <button className="btn btn-primary text-nowrap" type="submit">
            {editingId ? 'Update Image' : 'Add Image'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setImageUrl('');
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <div className="row g-3">
          {images.map((item) => {
            const id = item._id || item.id;
            return (
              <div key={id} className="col-6 col-md-4 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden h-100">
                  <img
                    src={item.image}
                    alt="Gallery item"
                    className="card-img-top object-fit-cover"
                    style={{ height: 200 }}
                  />
                  <div className="card-body p-2 d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setEditingId(id);
                        setImageUrl(item.image);
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}