import axios from './axios-config';

export const flushDatabase = async (databaseType: string) => {
    try {
        const response = await axios.delete(`/settings/flush-database/?database_type=${databaseType}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 