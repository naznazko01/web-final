const API_BASE_URL = '/api';

const api = {
    async get(endpoint, token = null) {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
            if (!response.ok) throw new Error(await response.text());
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async post(endpoint, body, token = null) {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API Error');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};
