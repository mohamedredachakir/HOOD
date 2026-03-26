<script setup>
import { store } from './store';
import AnnBar from './components/AnnBar.vue';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';

const router = useRouter();

// Initial load
onMounted(async () => {
    await store.init();
});

const goToShop = () => {
    store.cartOpen = false;
    router.push({ name: 'shop' });
};

const checkout = async () => {
    const placed = await store.placeOrder();
    if (placed) {
        router.push({ name: 'profile' });
    }
};
</script>

<template>
  <div id="hood-app">
    <AnnBar />
    <NavBar />

    <main class="main-content">
            <RouterView />
    </main>

    <Footer />

    <!-- TOASTS -->
    <div class="toast" :class="{on: store.toasts.length > 0}">
        {{ store.toasts[0]?.msg }}
    </div>

    <!-- Side Cart -->
     <div class="cb" :class="{on: store.cartOpen}" @click="store.cartOpen = false"></div>
     <div class="cd" :class="{on: store.cartOpen}">
        <div class="cd-hdr">
            <span class="cd-title">CART ({{ store.cart.items.length }})</span>
            <button class="cd-close" @click="store.cartOpen = false">×</button>
        </div>
        
        <div class="cd-body">
            <div v-if="store.cart.items.length === 0" class="cd-empty">
                <div class="cd-empty-txt">YOUR CART IS EMPTY.<br>START WITH ONE HOODIE.</div>
                <button class="btn-cta" style="margin-top:12px; font-size:9px;" @click="goToShop">SHOP NOW →</button>
            </div>
            
            <div v-for="item in store.cart.items" :key="item.id" class="ci">
                <div class="ci-img">
                    <img v-if="item.product.image_url" :src="item.product.image_url">
                    <div v-else>HOOD</div>
                </div>
                <div class="ci-info">
                    <div class="ci-name">{{ item.product.name }}</div>
                    <div class="ci-p">{{ item.product.price }} MAD</div>
                    <div class="ci-qty">
                        <button class="qb" @click="store.updateCart(item.id, item.quantity - 1)">-</button>
                        <span class="qn">{{ item.quantity }}</span>
                        <button class="qb" @click="store.updateCart(item.id, item.quantity + 1)">+</button>
                    </div>
                </div>
                <button class="ci-rm" @click="store.removeFromCart(item.id)">×</button>
            </div>
        </div>
        
        <div v-if="store.cart.items.length > 0" class="cd-foot">
            <div class="cd-tot"><span>TOTAL</span><span class="cd-tot-v">{{ store.cart.total }} MAD</span></div>
            <button class="btn-co" @click="checkout">CHECKOUT →</button>
        </div>
     </div>
  </div>
</template>

<style>
/* Main app layout */
.main-content {
    min-height: 80vh;
}

/* Base transitions and animations are in style.css */
</style>

