<script setup>
import { store } from '../store';
import { onMounted, ref, reactive } from 'vue';
import { api } from '../api';
import { useRouter } from 'vue-router';

const router = useRouter();

const orders = ref([]);
const mode = ref('orders'); // orders | settings
const form = reactive({
    name: store.user?.name || '',
    email: store.user?.email || '',
    phone: store.user?.phone || '',
    password: '',
    password_confirmation: ''
});

onMounted(async () => {
    try {
        const res = await api.get('/orders');
        orders.value = res.data;
    } catch (e) { console.error(e); }
});

const update = async () => {
    try {
        const res = await api.put('/user', form);
        store.user = res.user;
        localStorage.setItem('user', JSON.stringify(res.user));
        store.addToast('IDENTIFICATION UPDATED.');
        form.password = '';
        form.password_confirmation = '';
    } catch (e) { store.addToast(e.message, 'error'); }
};

const logout = () => {
   store.logout();
   router.push({ name: 'home' });
};
</script>

<template>
  <div class="pg on">
    <!-- HERO / TITLE -->
    <div class="p-hero">
       <div class="p-hero-label">— MEMBER ACCESS</div>
       <h1 class="p-hero-h">ARCHIVE / {{ store.user?.name.toUpperCase() }}</h1>
       <div class="p-hero-actions">
          <button @click="mode = 'orders'" :class="{active: mode === 'orders'}">ORDERS</button>
          <button @click="mode = 'settings'" :class="{active: mode === 'settings'}">SETTINGS</button>
          <button @click="logout" class="p-logout">EXIT ACCOUNT</button>
       </div>
    </div>

    <!-- ORDERS LIST (RAW) -->
    <div v-if="mode === 'orders'" class="p-content">
       <div v-if="orders.length === 0" class="p-null">
          NO ORDERS FOUND IN ARCHIVE.
          <br><br>
          <button class="lnk-all" @click="router.push({ name: 'shop' })">GO TO SHOP →</button>
       </div>
       <div v-else class="p-list">
          <div v-for="o in orders" :key="o.id" class="p-row">
             <div class="p-row-hdr">
                <span class="p-id">ORDER #{{ o.order_id }}</span>
                <span class="p-st">{{ o.status.toUpperCase() }}</span>
             </div>
             <div class="p-row-body">
                <div v-for="it in o.items" :key="it.id" class="p-item">
                   {{ it.product?.name }} [{{ it.size || 'M' }}] x{{ it.quantity }}
                </div>
             </div>
             <div class="p-row-ft">
                <span class="p-date">{{ new Date(o.created_at).toLocaleDateString() }}</span>
                <span class="p-tot">{{ o.total_amount }} MAD</span>
             </div>
          </div>
       </div>
    </div>

    <!-- SETTINGS (RAW) -->
    <div v-if="mode === 'settings'" class="p-content">
       <div class="p-form">
          <div class="p-sec-h">— IDENTITY / MASTER DATA</div>
          <div class="p-form-grid">
             <div class="fl"><label class="p-lab">FULL_NAME</label><input v-model="form.name" class="fi p-fi" type="text"></div>
             <div class="fl"><label class="p-lab">EMAIL_ADDR</label><input v-model="form.email" class="fi p-fi" type="email"></div>
             <div class="fl"><label class="p-lab">PHONE_NUMBER</label><input v-model="form.phone" class="fi p-fi" type="tel" placeholder="+ 212 6XX XXX XXX"></div>
          </div>
          
          <div class="p-sec-h" style="margin-top:60px">— ACCESS / SECURITY</div>
          <div class="p-form-grid">
             <div class="fl"><label class="p-lab">NEW_MASTER_KEY</label><input v-model="form.password" class="fi p-fi" type="password" placeholder="LEAVE BLANK FOR NO CHANGE"></div>
             <div class="fl"><label class="p-lab">CONFIRM_KEY</label><input v-model="form.password_confirmation" class="fi p-fi" type="password"></div>
          </div>
          
          <div class="p-submit-wrap">
             <button class="btn-auth p-btn" @click="update">COMMIT CHANGES //</button>
          </div>
       </div>
    </div>

    <!-- MANIFESTO FOOTER (CONTEXT) -->
    <div class="p-mani">
       <div class="mani-eye">EST. 2024</div>
       <div class="mani-body">THE ARCHIVE IS PERMANENT. YOUR STORY IS WRITTEN IN CLOTH.</div>
    </div>
  </div>
</template>

<style scoped>
.p-hero { padding: 80px 40px 40px; border-bottom: 1px solid var(--b1); }
.p-hero-label { font-family: var(--font-d); font-size: 9px; color: var(--w4); letter-spacing: .2em; margin-bottom: 12px; }
.p-hero-h { font-family: var(--font-rock); font-size: clamp(24px, 6vw, 64px); line-height: 1; letter-spacing: -0.02em; }
.p-hero-actions { margin-top: 40px; display: flex; gap: 24px; }
.p-hero-actions button { font-family: var(--font-d); font-size: 10px; color: var(--w4); letter-spacing: .12em; transition: .2s; }
.p-hero-actions button:hover, .p-hero-actions button.active { color: var(--w); }
.p-logout { color: var(--red) !important; opacity: .7; }
.p-logout:hover { opacity: 1; }

.p-content { padding: 40px; min-height: 400px; }
.p-null { font-family: var(--font-d); font-size: 14px; color: var(--w3); padding-top: 60px; }

.p-list { display: grid; gap: 1px; background: var(--b1); border: 1px solid var(--b1); }
.p-row { background: var(--void); padding: 40px; }
.p-row-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.p-id { font-family: var(--font-d); font-size: 11px; letter-spacing: .15em; }
.p-st { border: 1px solid var(--b2); padding: 3px 10px; font-size: 9px; font-family: var(--font-d); }
.p-row-body { margin-bottom: 32px; display: flex; flex-direction: column; gap: 8px; }
.p-item { font-size: 13px; color: var(--w3); }
.p-row-ft { display: flex; justify-content: space-between; border-top: 1px solid var(--b1); padding-top: 24px; font-family: var(--font-d); }
.p-date { font-size: 10px; color: var(--w4); }
.p-tot { font-size: 14px; }

.p-form { max-width: 900px; }
.p-sec-h { font-family: var(--font-rock); font-size: 14px; color: var(--w); margin-bottom: 40px; letter-spacing: .05em; }
.p-form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 48px; margin-bottom: 24px; }
.p-fi { background: transparent; border-bottom: 1px solid var(--b1); border-left: none; border-right: none; border-top: none; padding-bottom: 14px; color: var(--w); font-size: 14px; }
.p-fi:focus { border-color: var(--w); outline: none; }
.p-lab { font-family: var(--font-d); font-size: 8px; letter-spacing: .25em; color: var(--w3); margin-bottom: 24px; display: block; }
.p-submit-wrap { margin-top: 60px; padding-top: 40px; border-top: 1px solid var(--b1); }
.p-btn { border: 1px solid var(--w); width: fit-content; padding: 18px 50px; border-radius: 0; color: var(--w); }
.p-btn:hover { background: var(--w); color: var(--void); }

.p-mani { padding: 100px 40px; border-top: 1px solid var(--b1); text-align: left; }
.mani-eye { font-family: var(--font-d); font-size: 9px; color: var(--acc); letter-spacing: .3em; margin-bottom: 24px; }
.mani-body { font-family: var(--font-d); font-size: 11px; color: var(--w4); line-height: 1.8; max-width: 400px; text-transform: uppercase; }
</style>
