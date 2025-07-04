import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_BASEURL || 'http://localhost:8000/api';


export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    access: string,
    refresh: string
}

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await axios.post(`${API_URL}/auth/login/`, credentials);
        return data;
    },

    logout: async (): Promise<void> => {
        await axios.post(`${API_URL}/auth/logout/`);
    }
}; 