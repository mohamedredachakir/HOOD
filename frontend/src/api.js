const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
    async fetch(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Accept': 'application/json',
            ...options.headers,
        };

        // Don't set content-type for FormData, fetch handles it
        if (options.body && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            const err = new Error(data.message || 'API Error');
            err.response = { data }; // Expose errors for Admin display
            throw err;
        }

        return data;
    },

    get(endpoint) {
        return this.fetch(endpoint, { method: 'GET' });
    },

    post(endpoint, data) {
        const body = (data instanceof FormData) ? data : JSON.stringify(data);
        return this.fetch(endpoint, { method: 'POST', body });
    },

    put(endpoint, data) {
        const body = (data instanceof FormData) ? data : JSON.stringify(data);
        return this.fetch(endpoint, { method: 'PUT', body });
    },

    delete(endpoint) {
        return this.fetch(endpoint, { method: 'DELETE' });
    }
};
