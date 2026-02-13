import axios from 'axios';
import Cookies from 'js-cookie';

export const API_URL = process.env.NEXT_PUBLIC_BASEURL || 'http://localhost:8000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't log if there's no response (network errors, etc.)
        if (!error.response) {
            return Promise.reject(error);
        }

        const status = error.response.status;
        const errorData = error.response.data;
        
        // Don't log successful status codes (200, 204, etc.)
        if (status < 400) {
            return Promise.reject(error);
        }

        // Only log actual errors (4xx, 5xx) with meaningful data
        // Skip logging if errorData is empty object {} or null/undefined
        const isEmptyObject = errorData && 
            typeof errorData === 'object' && 
            !Array.isArray(errorData) &&
            Object.keys(errorData).length === 0;
        
        if (isEmptyObject) {
            // Don't log empty error objects
            return Promise.reject(error);
        }

        // Log errors with meaningful data
        if (errorData) {
            console.error('API Error:', {
                message: error.message || 'Request failed',
                response: errorData,
                status: status,
            });
        } else if (status >= 500) {
            // Only log server errors (5xx) even without data
            console.error('API Error:', {
                message: error.message || 'Server error',
                status: status,
            });
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance; 