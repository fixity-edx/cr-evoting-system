import axios from 'axios';
import { getToken } from '../utils/token';

const API_URL = 'http://localhost:5000/api/vote';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const castVote = (candidateId) => api.post('/', { candidateId });
export const getResults = () => api.get('/results');
