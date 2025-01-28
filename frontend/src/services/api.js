import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://abkhd-online-store.onrender.com/api'
    : 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;