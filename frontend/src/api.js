const API_BASE_URL = 'http://localhost:8000/api';
const GET_CACHE_TTL_MS = 30 * 1000;
const inflightGetRequests = new Map();
const getResponseCache = new Map();

const isCacheableCatalogEndpoint = (endpoint) => {
    const normalized = endpoint.replace(/^\//, '');
    return /^products(\/|\?|$)|^categories(\/|\?|$)/.test(normalized);
};

const buildGetCacheKey = (url, token) => `${url}::${token || 'guest'}`;

export const api = {
    async fetch(endpoint, options = {}) {
        const method = (options.method || 'GET').toUpperCase();
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
        const isCacheableGet = method === 'GET' && isCacheableCatalogEndpoint(endpoint);
        const cacheKey = buildGetCacheKey(url, token);

        if (isCacheableGet) {
            const cached = getResponseCache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < GET_CACHE_TTL_MS) {
                return cached.data;
            }

            const inflight = inflightGetRequests.get(cacheKey);
            if (inflight) {
                return inflight;
            }
        }

        const requestPromise = (async () => {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            let fallbackMessage = 'API Error';
            if (response.status === 413) {
                fallbackMessage = 'Upload too large. Please use a smaller image.';
            } else if (response.status === 422) {
                fallbackMessage = 'Validation failed. Check your form fields.';
            } else if (response.status === 401) {
                fallbackMessage = 'Unauthenticated.';
            } else if (response.status === 403) {
                fallbackMessage = 'Forbidden.';
            }

            const err = new Error(data.message || fallbackMessage);
            err.status = response.status;
            err.response = { data, status: response.status }; // Expose errors for Admin display
            throw err;
        }

        if (isCacheableGet) {
            getResponseCache.set(cacheKey, {
                data,
                timestamp: Date.now(),
            });
        }

        return data;
        })();

        if (!isCacheableGet) {
            return requestPromise;
        }

        inflightGetRequests.set(cacheKey, requestPromise);

        try {
            return await requestPromise;
        } finally {
            inflightGetRequests.delete(cacheKey);
        }
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
