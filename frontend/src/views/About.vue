<script setup>
import { store } from '../store';
</script>

<template>
  <div class="pg on">
    <div class="ab-hero">
      <div class="ab-eye">— The Story Behind the Hood —</div>
      <h1 class="ab-h">WE MAKE<br>ONE THING.<br><span style="color:var(--w3)">WE MAKE IT RIGHT.</span></h1>
    </div>
    <div class="ab-grid">
      <div class="ab-cell"><div class="ab-num">01</div><div class="ab-ct">Why Only Hoodies?</div><p class="ab-cp">Every brand tries to be everything. We refused. HOOD was built on one conviction: obsess over one thing and perfect it.</p></div>
      <div class="ab-cell"><div class="ab-num">02</div><div class="ab-ct">The Weight Standard</div><p class="ab-cp">We don't compromise on fabric. Every HOOD hoodie starts at 380gsm French Terry or heavier.</p></div>
      <div class="ab-cell"><div class="ab-num">03</div><div class="ab-ct">Slow Drops</div><p class="ab-cp">We drop rarely. When we do, it's deliberate. No filler, no fads. Dead stock mentality.</p></div>
      <div class="ab-cell"><div class="ab-num">04</div><div class="ab-ct">Independence</div><p class="ab-cp">HOOD is fully independent. No investors. No retail compromises.</p></div>
    </div>
  </div>
</template>

<style scoped>
.ab-hero { padding: 88px 40px 72px; border-bottom: 1px solid var(--b1); }
.ab-eye { font-family: var(--font-d); font-size: 9px; letter-spacing: .26em; color: var(--w4); margin-bottom: 20px; text-transform: uppercase; }
.ab-h { font-family: var(--font-rock); font-size: clamp(36px, 8vw, 100px); text-transform: uppercase; line-height: .9; max-width: 900px; }
.ab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--b1); }
.ab-cell { background: var(--void); padding: 52px 44px; }
.ab-cell:nth-child(even) { background: var(--s1); }
.ab-num { font-family: var(--font-d); font-size: 52px; color: var(--w4); line-height: 1; margin-bottom: 14px; }
.ab-ct { font-family: var(--font-d); font-size: 12px; text-transform: uppercase; margin-bottom: 10px; }
.ab-cp { font-size: 13px; color: var(--w3); line-height: 1.9; max-width: 400px; }
</style>
