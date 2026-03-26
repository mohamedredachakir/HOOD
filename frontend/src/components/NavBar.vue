<script setup>
import { store } from '../store';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const goToAccount = () => {
  router.push({ name: store.user ? 'profile' : 'auth' });
};

const isActive = (routeName) => route.name === routeName;
</script>

<template>
  <nav class="nav">
    <div class="nav-logo" @click="router.push({ name: 'home' })">HOOD™</div>
    <div class="nav-links">
      <button class="nav-lnk" :class="{on: isActive('home')}" @click="router.push({ name: 'home' })">Home</button>
      <button class="nav-lnk" :class="{on: isActive('shop')}" @click="router.push({ name: 'shop' })">Shop</button>
      <button class="nav-lnk" :class="{on: isActive('collections')}" @click="router.push({ name: 'collections' })">Collections</button>
      <button v-if="store.user?.role === 'admin'" class="nav-lnk" :class="{on: isActive('admin')}" @click="router.push({ name: 'admin' })">Admin</button>
      <button class="nav-lnk" :class="{on: isActive('about')}" @click="router.push({ name: 'about' })">About</button>
      <button class="nav-lnk" :class="{on: isActive('contact')}" @click="router.push({ name: 'contact' })">Contact</button>
    </div>
    <div class="nav-r">
      <button class="nav-usr" @click="goToAccount">
        {{ store.user ? store.user.name.toUpperCase() : 'LOGIN' }}
      </button>
      <button class="cart-trig" @click="store.cartOpen = true">
        CART <span class="c-pill">{{ store.cart.items.length }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 90;
  background: rgba(5,5,5,.97);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--b1);
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.nav-logo {
  font-family: var(--font-rock);
  font-size: 18px;
  letter-spacing: .22em;
  cursor: pointer;
  transition: opacity .15s;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-lnk {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--w3);
  transition: color .15s;
}

.nav-lnk:hover, .nav-lnk.on {
  color: var(--w);
}

.nav-r {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-usr { font-family: var(--font-d); font-size: 10px; color: var(--w3); letter-spacing: 0.1em;}
.nav-usr:hover { color: var(--w); }

.cart-trig {
  border: 1px solid var(--b2);
  padding: 6px 14px;
  font-family: var(--font-d);
  font-size: 9px;
  letter-spacing: .12em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: border-color .15s;
}

.cart-trig:hover {
  border-color: var(--w);
}

.c-pill {
  background: var(--w);
  color: var(--void);
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  min-width: 16px;
  text-align: center;
}
</style>
