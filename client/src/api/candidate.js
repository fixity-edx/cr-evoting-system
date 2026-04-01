import axios from 'axios';
import { getToken } from '../utils/token';

const API_URL = 'http://localhost:5000/api/candidates';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const applyForCandidacy = (data) => api.post('/apply', data);
export const getCandidates = () => api.get('/');
export const getPendingCandidates = () => api.get('/pending');
export const approveCandidate = (id) => api.put(`/${id}/approve`);
export const rejectCandidate = (id) => api.delete(`/${id}/reject`);
