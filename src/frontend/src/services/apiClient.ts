import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5074/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('zacatlan_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('zacatlan_admin_token');
    }
    const customMessage = error.response?.data?.detail || error.response?.data?.message || 'Ocurrió un error al comunicarse con el servidor.';
    console.error('[API Error]:', customMessage, error);
    return Promise.reject(new Error(customMessage));
  }
);
