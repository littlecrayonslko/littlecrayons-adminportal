import { request } from '../api/client';

export const authApi = {
  login: async (credentials) => {
    const res = await request('/admin/login', {
      method: 'POST',
      body: credentials,
    });
    if (res?.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('isAuthenticated', 'true');
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    }
    return res;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

export const blogApi = {
  getAll: () => request('/blogs'),
  create: (formData) =>
    request('/blogs', {
      method: 'POST',
      body: formData,
    }),
  delete: (id) =>
    request(`/blogs/${id}`, {
      method: 'DELETE',
    }),
};

export const franchiseApi = {
  getAll: () => request('/franchise'),
  create: (formData) =>
    request('/franchise', {
      method: 'POST',
      body: formData,
    }),
  delete: (id) =>
    request(`/franchise/${id}`, {
      method: 'DELETE',
    }),
};

export const galleryApi = {
  getAll: () => request('/gallery'),
  create: (formData) =>
    request('/gallery', {
      method: 'POST',
      body: formData,
    }),
  delete: (id) =>
    request(`/gallery/${id}`, {
      method: 'DELETE',
    }),
};