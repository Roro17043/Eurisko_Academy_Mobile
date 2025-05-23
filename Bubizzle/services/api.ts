import axios from 'axios';
import { store } from '../RTKstore';
import { logout, setCredentials } from '../RTKstore/slices/authSlice';

const api = axios.create({
  baseURL: 'https://backend-practice.eurisko.me/api',
  timeout: 30000,
});

api.interceptors.request.use(
  config => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const { refreshToken, email } = store.getState().auth;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axios.post('https://backend-practice.eurisko.me/api/auth/refresh-token', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        if (!email) throw new Error('Email is missing in Redux store.');

        store.dispatch(setCredentials({ accessToken, refreshToken: newRefreshToken, email }));

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = 'Bearer ' + accessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
