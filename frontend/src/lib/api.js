import axios from "axios";
import { getToken, removeToken } from "./auth";

// automatically adds bearer header on every request
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API || 'http://localhost:5000',
    withCredentials: true
});

// automaticallly attaches token on request
api.interceptors.request.use(config => {
    const token = getToken();
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error);
});

// logout and redirection to login
api.interceptors.request.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            removeToken();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);