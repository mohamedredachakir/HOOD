import { reactive } from 'vue';
import { api } from './api';

const PRODUCTS_CACHE_KEY = 'hood_products_cache_v1';
const CATEGORIES_CACHE_KEY = 'hood_categories_cache_v1';
const CACHE_TTL_MS = 5 * 60 * 1000;

const readCache = (key) => {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null;
        if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
        return parsed.data;
    } catch {
        return null;
    }
};

const writeCache = (key, data) => {
    try {
        sessionStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    } catch {
        // Ignore storage failures to keep runtime resilient.
    }
};

export const store = reactive({
    // State
    view: 'home',
    subView: null, // for inner pages or tabs
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    products: [],
    categories: [],
    cart: { items: [], total: 0 },
    cartOpen: false,
    selectedProduct: null,
    activeCategory: null, // Shared filter
    toasts: [],
    loading: false,

    // -- INIT --
    async init() {
        try {
            const cachedProducts = readCache(PRODUCTS_CACHE_KEY);
            const cachedCategories = readCache(CATEGORIES_CACHE_KEY);

            if (cachedProducts?.length) this.products = cachedProducts;
            if (cachedCategories?.length) this.categories = cachedCategories;

            const startupRequests = [this.fetchProducts(), this.fetchCategories()];
            if (this.token) startupRequests.push(this.fetchCart());

            await Promise.all(startupRequests);
        } catch (e) {
            console.error("Init failed", e);
            this.addToast("BACKEND OFFLINE. SOME FEATURES DISABLED.", "error");
        }
    },

    // -- AUTH ACTIONS --
    async login(credentials) {
        try {
            const data = await api.post('/login', credentials);
            this.user = data.user;
            this.token = data.access_token;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            this.addToast('LOGIN SUCCESSFUL. WELCOME BACK.');
            this.view = 'home';
            await this.fetchCart();
        } catch (e) { this.addToast(e.message, 'error'); }
    },

    async register(userData) {
        try {
            const data = await api.post('/register', userData);
            this.user = data.user;
            this.token = data.access_token;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            this.addToast('ACCOUNT CREATED. WELCOME TO HOOD.');
            this.view = 'home';
            await this.fetchCart();
        } catch (e) { this.addToast(e.message, 'error'); }
    },

    logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.cart = { items: [], total: 0 };
        this.addToast('LOGGED OUT.');
        this.view = 'home';
    },

    // -- PRODUCT ACTIONS --
    async fetchProducts() {
        this.loading = true;
        try {
            const res = await api.get('/products');
            this.products = res.data || res;
            writeCache(PRODUCTS_CACHE_KEY, this.products);
        } finally {
            this.loading = false;
        }
    },

    async fetchCategories() {
        const res = await api.get('/categories');
        this.categories = res.data || res;
        writeCache(CATEGORIES_CACHE_KEY, this.categories);
    },

    // -- CART ACTIONS --
    async placeOrder() {
        if (this.cart.items.length === 0) return;
        try {
            const data = await api.post('/orders', {
                items: this.cart.items.map(i => ({ 
                    product_id: i.product_id, 
                    quantity: i.quantity,
                    size: i.size 
                }))
            });
            this.addToast('ORDER PLACED SUCCESSFULLY. THANK YOU.');
            this.cart.items = [];
            this.cartOpen = false;
            this.view = 'profile'; // Redirect to see order
        } catch (e) { this.addToast(e.message, 'error'); }
    },

    async fetchCart() {
        const res = await api.get('/cart');
        this.cart = res;
    },

    async addToCart(productId, quantity = 1) {
        try {
            await api.post('/cart', { product_id: productId, quantity });
            await this.fetchCart();
            this.addToast('ITEM ADDED TO CART.');
            this.cartOpen = true;
        } catch (e) { this.addToast(e.message, 'error'); }
    },

    async updateCart(id, qty) {
        await api.put(`/cart/${id}`, { quantity: qty });
        await this.fetchCart();
    },

    async removeFromCart(id) {
        await api.delete(`/cart/${id}`);
        await this.fetchCart();
    },


    // -- ORDER ACTIONS --
    async updateOrderStatus(orderId, status) {
        try {
            const res = await api.put(`/orders/${orderId}`, { status });
            return res;
        } catch (e) {
            throw new Error(e.response?.data?.message || 'Failed to update order status');
        }
    },

    // -- TOASTS --
    addToast(msg, type = 'success') {
        const id = Date.now();
        this.toasts.push({ id, msg, type });
        setTimeout(() => {
            this.toasts = this.toasts.filter(t => t.id !== id);
        }, 3000);
    }
});
