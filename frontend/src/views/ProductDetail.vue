<script setup>
import { store } from '../store';
import { ref } from 'vue';

const selectedSize = ref('M');
</script>

<template>
  <div class="pg on">
    <div v-if="store.selectedProduct" class="det-wrap">
      <div class="det-gal">
         <div class="det-main">
            <img v-if="store.selectedProduct.image_url" :src="store.selectedProduct.image_url" :alt="store.selectedProduct.name">
            <div v-else class="pp">{{ store.selectedProduct.name.split(' ').slice(-1)[0] }}</div>
         </div>
      </div>
      <div class="det-panel">
         <div class="det-coll">{{ store.selectedProduct.category?.name || 'HOOD ORIGINALS' }}</div>
         <h1 class="det-name">{{ store.selectedProduct.name }}</h1>
         <div class="det-price">
            <span v-if="store.selectedProduct.old_price" class="det-oldprice">{{ store.selectedProduct.old_price }} MAD</span>
            <span>{{ store.selectedProduct.price }} MAD</span>
         </div>
         <div class="det-div"></div>
         
         <div>
            <div class="sz-hdr">
               <span class="det-lbl">Select Size</span>
               <button class="lnk-all" style="font-size:9px">SIZE GUIDE</button>
            </div>
            <div class="sz-grid">
               <button 
                 v-for="s in ['S', 'M', 'L', 'XL']" 
                 :key="s" 
                 class="sz-btn" 
                 :class="{on: selectedSize === s}"
                 @click="selectedSize = s"
               >{{ s }}</button>
            </div>
         </div>

         <button class="btn-atc" @click="store.addToCart(store.selectedProduct.id)">ADD TO CART →</button>
         
         <p class="det-desc">
            {{ store.selectedProduct.description || 'Premium streetwear hoodie. Crafted for permanence. 380gsm French Terry. Relaxed fit. Made in Morocco.' }}
         </p>
         
         <div style="padding:16px; background:var(--s1); border:1px solid var(--b1)">
            <div style="font-family:var(--font-d); font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--w4); margin-bottom:8px">Free Returns &nbsp;·&nbsp; 30 Days</div>
            <div style="font-size:12px; color:var(--w3)">Not the right size? We cover return shipping within Morocco. No questions asked.</div>
         </div>
      </div>
    </div>
    
    <div v-else class="det-empty" style="padding: 200px; text-align: center; font-family: var(--font-d); color: var(--w4);">
      LOADING DROP...
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles removed - now handled by global style.css */
</style>

