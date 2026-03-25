<script setup>
import { store } from '../store';
import { ref } from 'vue';

const selectedSize = ref('M');
const showSizeGuide = ref(false);
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
               <button class="lnk-all" style="font-size:9px" @click="showSizeGuide = true">SIZE GUIDE</button>
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

    <!-- SIZE GUIDE MODAL -->
    <div v-if="showSizeGuide" class="modal-overlay" @click.self="showSizeGuide = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>SIZE GUIDE</h2>
          <button class="modal-close" @click="showSizeGuide = false">✕</button>
        </div>
        <div class="modal-body">
          <table class="size-table">
            <thead>
              <tr>
                <th>SIZE</th>
                <th>CHEST</th>
                <th>LENGTH</th>
                <th>SLEEVE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>S</strong></td>
                <td>48 cm</td>
                <td>69 cm</td>
                <td>84 cm</td>
              </tr>
              <tr>
                <td><strong>M</strong></td>
                <td>52 cm</td>
                <td>71 cm</td>
                <td>86 cm</td>
              </tr>
              <tr>
                <td><strong>L</strong></td>
                <td>56 cm</td>
                <td>73 cm</td>
                <td>88 cm</td>
              </tr>
              <tr>
                <td><strong>XL</strong></td>
                <td>60 cm</td>
                <td>75 cm</td>
                <td>90 cm</td>
              </tr>
            </tbody>
          </table>
          <div class="size-note">
            <p style="margin-top: 20px; font-size: 12px; color: var(--w3); line-height: 1.8;">
              <strong>How to Measure:</strong><br>
              • <strong>Chest:</strong> Measure across the widest part of the chest, armpit to armpit<br>
              • <strong>Length:</strong> Measure from the shoulder down to the hem<br>
              • <strong>Sleeve:</strong> Measure from the center back neck to the wrist<br><br>
              All measurements are for a relaxed fit. Our hoodies are designed with a comfortable, oversized silhouette.<br>
              If you're between sizes, we recommend sizing up for maximum comfort.
            </p>
          </div>
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

