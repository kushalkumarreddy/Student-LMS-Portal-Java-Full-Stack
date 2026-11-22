
import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const trimmedUrl = rawBaseUrl.replace(/\/+$/, '');
const resolvedBaseUrl = trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;

const api = axios.create({
  baseURL: resolvedBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem('edutrack_user') || 'null'
    );
  } catch {
    localStorage.removeItem('edutrack_user');
  }

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      localStorage.getItem('edutrack_user')
    ) {
      localStorage.removeItem('edutrack_user');
      localStorage.removeItem('edutrack_learning_course');

      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default api;
