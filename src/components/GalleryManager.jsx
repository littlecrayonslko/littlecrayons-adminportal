/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { galleryApi } from '../api/services';

const PRESET_CATEGORIES = [
  'General',
  'Classrooms',
  'Playtime',
  'Sports',
  'Arts & Crafts',
  'Events',
  'STEM',
  'Music'
];

export default function GalleryManager({ onBack }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const loadGallery = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await galleryApi.getAll();
      const list = Array.isArray(res) ? res : res?.data || [];
      setImages(list);
    } catch (err) {
      console.error('Fetch gallery error:', err);
      setErrorMsg(err.message || 'Failed to fetch gallery records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

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
      setErrorMsg('Please select an image file to upload.');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Image title/caption is required.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      // Backend expects strictly field name: 'image'
      formData.append('image', imageFile);

      await galleryApi.create(formData);

      setSuccessMsg('Gallery image uploaded and published successfully!');
      setTitle('');
      setCategory('General');
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await loadGallery();
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Failed to upload photo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      await galleryApi.delete(id);
      setImages((prev) => prev.filter((img) => (img._id || img.id) !== id));
      setSuccessMsg('Photo deleted successfully.');
    } catch (err) {
      console.error('Delete error:', err);
      setErrorMsg(err.message || 'Failed to delete photo.');
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <button 
            className="btn btn-outline-secondary btn-sm mb-2 d-inline-flex align-items-center gap-1"
            onClick={onBack}
          >
            &larr; Back to Dashboard
          </button>
          <h3 className="fw-bold text-dark mb-0">Gallery Manager</h3>
          <p className="text-muted small mb-0">Upload new campus activity pictures and manage existing media.</p>
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

      {/* Upload Form Card */}
      <div className="card shadow-sm border-0 p-3 p-md-4 mb-5 rounded-4">
        <h5 className="fw-bold text-dark mb-3">Upload New Gallery Asset</h5>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-5">
              <label className="form-label fw-semibold text-secondary small">Image Title / Activity Caption *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Annual Day Dance Performance"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-secondary small">Category Section *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-secondary small">Select Local Image *</label>
              <input
                ref={fileInputRef}
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              {imageFile && (
                <div className="small text-success mt-1 text-truncate">
                  Selected: <strong>{imageFile.name}</strong> ({(imageFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button 
              className="btn btn-primary px-4 py-2 fw-semibold" 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Streaming to Cloudinary...
                </>
              ) : (
                'Upload & Publish'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <h5 className="fw-bold text-dark mb-3">Published Photos ({images.length})</h5>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted small mt-2">Loading gallery...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center py-5 text-muted">
          <p className="mb-0">No photos published in the gallery yet.</p>
        </div>
      ) : (
        <div className="row g-3">
          {images.map((item) => {
            const id = item._id || item.id;
            const imgSrc = item.image_url || item.image || 'https://placehold.co/400x300?text=No+Preview';
            const cat = item.category || 'General';

            return (
              <div key={id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={imgSrc}
                      alt={item.title || 'Gallery item'}
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x300?text=Error';
                      }}
                    />
                  </div>
                  <div className="card-body p-3 d-flex flex-column justify-content-between">
                    <div>
                      <span className="badge bg-light text-primary border mb-1 small">{cat}</span>
                      <h6 className="fw-bold text-dark mb-0 text-truncate" title={item.title}>
                        {item.title || 'Untitled Photo'}
                      </h6>
                    </div>
                    <div className="pt-3 border-top mt-3 text-end">
                      <button
                        className="btn btn-sm btn-outline-danger px-3 rounded-pill"
                        onClick={() => handleDelete(id)}
                      >
                        Delete
                      </button>
                    </div>
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