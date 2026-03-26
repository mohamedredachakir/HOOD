import { createRouter, createWebHistory } from 'vue-router';
import { store } from './store';
import Home from './views/Home.vue';
import Shop from './views/Shop.vue';
import Collections from './views/Collections.vue';
import About from './views/About.vue';
import Contact from './views/Contact.vue';
import Auth from './views/Auth.vue';
import Profile from './views/Profile.vue';
import Admin from './views/Admin.vue';
import ProductDetail from './views/ProductDetail.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/shop', name: 'shop', component: Shop },
  { path: '/collections', name: 'collections', component: Collections },
  { path: '/about', name: 'about', component: About },
  { path: '/contact', name: 'contact', component: Contact },
  { path: '/auth', name: 'auth', component: Auth, meta: { guestOnly: true } },
  { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/product/:id', name: 'product-detail', component: ProductDetail, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const isAuthenticated = !!store.user;
  const isAdmin = store.user?.role === 'admin';

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'auth',
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return { name: 'home' };
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'home' };
  }

  return true;
});

export default router;
