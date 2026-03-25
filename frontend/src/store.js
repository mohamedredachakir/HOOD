import { reactive } from 'vue';
import { api } from './api';

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
            await this.fetchProducts();
            await this.fetchCategories();
            if (this.token) await this.fetchCart();
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
        const res = await api.get('/products');
        this.products = res.data || res;
    },

    async fetchCategories() {
        const res = await api.get('/categories');
        this.categories = res.data || res;
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

    // -- TOASTS --
    addToast(msg, type = 'success') {
        const id = Date.now();
        this.toasts.push({ id, msg, type });
        setTimeout(() => {
            this.toasts = this.toasts.filter(t => t.id !== id);
        }, 3000);
    }
});
