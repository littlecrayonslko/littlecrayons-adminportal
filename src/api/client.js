// src/config/client.js
const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export async function request(endpoint, options = {}) {
  const { headers: customHeaders = {}, body, ...restOptions } = options;

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const headers = { ...customHeaders };

  // Strict check: Agar body FormData hai, toh Content-Type header mat bhejo (browser boundary set karega)
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (isFormData) {
    delete headers['Content-Type'];
  } else if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Body handling
  let formattedBody = body;
  if (!isFormData && body && typeof body === 'object') {
    formattedBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
    body: formattedBody,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || data.error || `HTTP ${response.status}: Request failed`;
    throw new Error(errorMsg);
  }

  return data;
}