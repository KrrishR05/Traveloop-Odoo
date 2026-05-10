/**
 * Traveloop API Service Layer
 * Central client for communicating with the Django REST backend.
 */

const API_BASE = '/api';

// ── Token management ────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('traveloop_token');
}

function setToken(token) {
  localStorage.setItem('traveloop_token', token);
  localStorage.setItem('traveloop_token_time', Date.now().toString());
}

function clearToken() {
  localStorage.removeItem('traveloop_token');
  localStorage.removeItem('traveloop_token_time');
  localStorage.removeItem('traveloop_user');
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem('traveloop_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user) {
  localStorage.setItem('traveloop_user', JSON.stringify(user));
}

// ── Generic helpers ─────────────────────────────────────────────

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  // Attach auth token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const config = { headers, ...options };

  const res = await fetch(url, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const error = new Error(err.detail || err.error || `API error: ${res.status}`);
    error.status = res.status;
    error.data = err;
    throw error;
  }
  return res.json();
}

const get    = (endpoint) => request(endpoint);
const post   = (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) });
const put    = (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) });
const patch  = (endpoint, data) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data) });
const del    = (endpoint) => request(endpoint, { method: 'DELETE' });

// ── Auth Service ────────────────────────────────────────────────

export const authService = {
  register: async (data) => {
    const res = await post('/auth/register/', data);
    setToken(res.token);
    setStoredUser(res.user);
    return res;
  },
  login: async (email, password) => {
    const res = await post('/auth/login/', { email, password });
    setToken(res.token);
    setStoredUser(res.user);
    return res;
  },
  googleLogin: async (data) => {
    const res = await post('/auth/google-login/', data);
    setToken(res.token);
    setStoredUser(res.user);
    return res;
  },
  phoneLogin: (phone) => post('/auth/phone-login/', { phone }),
  verifyOTP: async (phone, otp) => {
    const res = await post('/auth/verify-otp/', { phone, otp });
    setToken(res.token);
    setStoredUser(res.user);
    return res;
  },
  logout: async () => {
    try {
      await post('/auth/logout/', {});
    } catch {
      // Ignore — token may already be invalid
    }
    clearToken();
  },
  forgotPassword: (data) => post('/auth/forgot-password/', data),
  getProfile: () => get('/auth/profile/'),
  updateProfile: (data) => patch('/auth/profile/', data),
  getToken,
  getStoredUser,
  clearToken,
};

// ── Trip Service ────────────────────────────────────────────────

export const tripService = {
  list:      ()       => get('/trips/'),
  detail:    (id)     => get(`/trips/${id}/`),
  create:    (data)   => post('/trips/', data),
  update:    (id, d)  => put(`/trips/${id}/`, d),
  remove:    (id)     => del(`/trips/${id}/`),
  analytics: ()       => get('/trips/analytics/'),
};

// ── Budget Service ──────────────────────────────────────────────

export const budgetService = {
  categories: (tripId) => get(`/budget/categories/?trip=${tripId}`),
  summary:    (tripId) => get(`/budget/categories/summary/?trip=${tripId}`),
  addItem:    (data)   => post('/budget/items/', data),
  updateItem: (id, d)  => patch(`/budget/items/${id}/`, d),
  removeItem: (id)     => del(`/budget/items/${id}/`),
  items:      (tripId) => get(`/budget/items/?trip=${tripId}`),
};

// ── Checklist Service ───────────────────────────────────────────

export const checklistService = {
  list:    (tripId)           => get(`/checklist/?trip=${tripId}`),
  summary: (tripId)           => get(`/checklist/summary/?trip=${tripId}`),
  add:     (data)             => post('/checklist/', data),
  toggle:  (id)               => patch(`/checklist/${id}/toggle/`),
  update:  (id, data)         => patch(`/checklist/${id}/`, data),
  remove:  (id)               => del(`/checklist/${id}/`),
};

// ── User Service ────────────────────────────────────────────────

export const userService = {
  profiles: ()       => get('/users/profiles/'),
  profile:  (id)     => get(`/users/profiles/${id}/`),
  update:   (id, d)  => patch(`/users/profiles/${id}/`, d),
};
