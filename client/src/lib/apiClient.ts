import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://crm-system-54cw.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error.response?.data || { message: 'Something went wrong' }
    );
  }
);

export default apiClient;
