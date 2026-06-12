import axios from 'axios';

export const apiPublic = axios.create({
  baseURL: '/api',  // ← modifié ici
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

export const api = axios.create({
  baseURL: '/api',  // ← modifié ici
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter le token automatiquement sur `api`
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;