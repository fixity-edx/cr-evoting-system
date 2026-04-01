import axios from 'axios';
import { getToken } from '../utils/token';

const API_URL = 'http://localhost:5000/api/auth';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});

export const loginUser = (credentials) => api.post('/login', credentials);
export const registerUser = (userData) => api.post('/register', userData);
export const getMe = () => api.get('/me');
