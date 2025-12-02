import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth API calls
export const authAPI = {
    signup: (userData) => api.post('/auth/signup', userData),
    verifyOTP: (otpData) => api.post('/auth/verify-otp', otpData),
    resendOTP: (email) => api.post('/auth/resend-otp', { email }),
    login: (credentials) => api.post('/auth/login', credentials),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    validateOTP: (otpData) => api.post('/auth/validate-otp', otpData),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Protected API calls (example)
export const protectedAPI = {
    getProfile: () => api.get('/test/protected'),
};

export const imageAPI = {
    upload: (formData) => api.post('/images/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default api;
