import { request } from './client';

// ================= AUTH API =================
export const authApi = {
  login: (credentials) =>
    request('/admin/login', {
      method: 'POST',
      body: credentials,
    }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  },
};

// ================= BLOG API (Create, Read, Delete) =================
export const blogApi = {
  getAll: () => request('/blogs'),
  create: (data) =>
    request('/blogs', {
      method: 'POST',
      body: data,
    }),
  delete: (id) =>
    request(`/blogs/${id}`, {
      method: 'DELETE',
    }),
};

// ================= FRANCHISE API (Create, Read, Delete) =================
export const franchiseApi = {
  getAll: () => request('/franchise'),
  create: (data) =>
    request('/franchise', {
      method: 'POST',
      body: data,
    }),
  delete: (id) =>
    request(`/franchise/${id}`, {
      method: 'DELETE',
    }),
};

// ================= GALLERY API (Create, Read, Delete) =================
export const galleryApi = {
  getAll: () => request('/gallery'),
  create: (data) =>
    request('/gallery', {
      method: 'POST',
      body: data,
    }),
  delete: (id) =>
    request(`/gallery/${id}`, {
      method: 'DELETE',
    }),
};