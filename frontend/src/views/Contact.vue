<script setup>
import { store } from '../store';
import { ref } from 'vue';

const subject = ref('');
const msg = ref('');

const send = () => {
    store.addToast('MESSAGE SENT. WE WILL REPLY WITHIN 24H.');
    subject.value = '';
    msg.value = '';
};
</script>

<template>
  <div class="pg on">
    <div class="ct-wrap">
      <div class="ct-l">
        <h1 class="ct-h">GET IN<br><span style="color:var(--w3)">TOUCH.</span></h1>
        <p class="ct-p">Questions about your order, sizing, or the next drop? We respond within 24 hours.</p>
        <div class="ct-info">
           <div class="ct-row"><span>Email</span><span>hello@hoodmaroc.com</span></div>
           <div class="ct-row"><span>Instagram</span><span>@hoodmaroc</span></div>
           <div class="ct-row"><span>Location</span><span>Marrakech, Morocco</span></div>
        </div>
      </div>
      <div class="ct-r">
        <div class="fl"><label class="fl-lbl">Subject</label><input v-model="subject" class="fi" type="text" placeholder="Order / Sizing / Other"></div>
        <div class="fl"><label class="fl-lbl">Message</label><textarea v-model="msg" class="fi ft" placeholder="Tell us what you need..."></textarea></div>
        <button class="btn-send" @click="send">SEND MESSAGE →</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ct-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--b1); min-height: calc(100vh - 84px); }
.ct-l { background: var(--void); padding: 72px 56px; }
.ct-h { font-family: var(--font-rock); font-size: clamp(30px, 6vw, 76px); text-transform: uppercase; line-height: .92; margin-bottom: 28px; }
.ct-p { font-size: 13px; color: var(--w3); max-width: 360px; line-height: 1.9; margin-bottom: 40px;}
.ct-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--b1); font-family: var(--font-d); font-size: 10px; }

.ct-r { background: var(--s1); padding: 72px 56px; }
.fl { margin-bottom: 18px; }
.fl-lbl { display: block; font-size: 9px; color: var(--w3); margin-bottom: 8px; text-transform: uppercase; }
.fi { width: 100%; background: var(--s2); border: 1px solid var(--b2); color: var(--w); padding: 12px; }
.ft { min-height: 120px; resize: vertical; }
.btn-send { width: 100%; background: var(--w); color: var(--void); padding: 14px; font-family: var(--font-d); margin-top: 10px; }
</style>
