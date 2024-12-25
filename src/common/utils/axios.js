import axios from 'axios';
import { store } from '../redux/store'; // Import the store

export const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: baseUrl, // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    // Add any other custom headers here
  },
});

const axiosInstance2 = axios.create({
  baseURL: baseUrl, // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    // Add any other custom headers here
  },
});

// Add a request interceptor for axiosInstance
axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // For example, add an authorization token
    const state = store.getState();
    const token = state.auth.accessToken; // Get token from Redux store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a request interceptor for axiosInstance2
axiosInstance2.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // For example, add an authorization token
    const state = store.getState();
    const token = state.oauth.accessToken; // Get token from Redux store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor for axiosInstance
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);

// Add a response interceptor for axiosInstance2
axiosInstance2.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosInstance2 };
