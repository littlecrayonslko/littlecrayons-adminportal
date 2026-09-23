const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://littlecrayons-backend-jmmh.onrender.com/api';
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export async function request(endpoint, options = {}) {
  const { headers: customHeaders = {}, body, ...restOptions } = options;

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const headers = { ...customHeaders };

  // Attach token automatically if stored
  const token = localStorage.getItem('token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData vs JSON
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (isFormData) {
    delete headers['Content-Type'];
  } else if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let formattedBody = body;
  if (!isFormData && body && typeof body === 'object') {
    formattedBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
    body: formattedBody,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || data.error || `HTTP ${response.status}: Request failed`;
    throw new Error(errorMsg);
  }

  return data;
}