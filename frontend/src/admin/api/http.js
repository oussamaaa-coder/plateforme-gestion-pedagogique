import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
export const STORAGE_URL = baseURL.replace('/api', '') + '/storage';

export const http = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function extractApiError(err) {
  const resp = err?.response?.data;
  
  if (resp?.errors && typeof resp.errors === 'object') {
    const errorMessages = Object.values(resp.errors).flat();
    if (errorMessages.length > 0) {
      return errorMessages.join(' ');
    }
  }

  if (resp?.message) return resp.message;
  return err?.message || 'Une erreur est survenue.';
}

