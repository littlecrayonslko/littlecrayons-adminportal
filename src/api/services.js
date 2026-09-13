import { request } from './client';

// Auth API
export const authApi = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  },
};

// Blog API
export const blogApi = {
  getAll: () => request('/blogs'),
  create: (data) =>
    request('/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/blogs/${id}`, {
      method: 'DELETE',
    }),
};

// Franchise API
export const franchiseApi = {
  getAll: () => request('/franchises'),
  create: (data) =>
    request('/franchises', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/franchises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/franchises/${id}`, {
      method: 'DELETE',
    }),
};

// Gallery API
export const galleryApi = {
  getAll: () => request('/gallery'),
  create: (data) =>
    request('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/gallery/${id}`, {
      method: 'DELETE',
    }),
};