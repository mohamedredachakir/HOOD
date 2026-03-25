<script setup>
import { store } from '../store';
</script>

<template>
  <footer class="foot">
    <div class="foot-top">
      <div class="foot-col">
        <div class="foot-logo">HOOD™</div>
        <p class="foot-tag">One Brand. One Product. No Compromise. Crafted with 380gsm minimum standard in Marrakech.</p>
      </div>
      <div class="foot-col">
        <div class="foot-h">SHOP</div>
        <button class="foot-lnk" @click="store.view = 'shop'">ALL HOODIES</button>
        <button class="foot-lnk" @click="store.view = 'collections'">COLLECTIONS</button>
        <button class="foot-lnk">NEW RELEASES</button>
      </div>
      <div class="foot-col">
        <div class="foot-h">STUDIO</div>
        <button class="foot-lnk" @click="store.view = 'about'">THE STORY</button>
        <button class="foot-lnk" @click="store.view = 'contact'">CONTACT</button>
        <button class="foot-lnk">SIZE GUIDE</button>
      </div>
      <div class="foot-col">
        <div class="foot-h">FOLLOW</div>
        <a href="#" class="foot-lnk">INSTAGRAM</a>
        <a href="#" class="foot-lnk">TIKTOK</a>
        <a href="#" class="foot-lnk">X.COM</a>
      </div>
    </div>
    <div class="foot-bot">
      <div class="foot-cp">© 2026 HOOD™ STUDIO. ALL RIGHTS RESERVED.</div>
      <div class="foot-loc">MARRAKECH // GLOBAL</div>
    </div>
  </footer>
</template>

<style scoped>
.foot { border-top: 1px solid var(--b1); padding: 72px 40px 24px; background: var(--void); }
.foot-top { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 72px; }
.foot-logo { font-family: var(--font-d); font-size: 16px; letter-spacing: .22em; margin-bottom: 12px; }
.foot-tag { font-size: 11px; color: var(--w4); line-height: 1.8; max-width: 220px; }
.foot-h { font-family: var(--font-d); font-size: 9px; letter-spacing: .2em; color: var(--w3); margin-bottom: 18px; }
.foot-lnk { display: block; font-size: 11px; color: var(--w4); margin-bottom: 10px; transition: 0.15s; text-align: left;}
.foot-lnk:hover { color: var(--w); }
.foot-bot { border-top: 1px solid var(--b1); padding-top: 24px; display: flex; justify-content: space-between; font-family: var(--font-d); font-size: 9px; color: var(--w4); letter-spacing: .12em;}
</style>
