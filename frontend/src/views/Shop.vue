<script setup>
import { store } from '../store';
import { onMounted, ref, watch } from 'vue';
import { api } from '../api';

const products = ref([]);
const categories = ref([]);
const search = ref('');
const loading = ref(false);
const sortOrder = ref('default');

const fetchDrops = async () => {
    loading.value = true;
    try {
        let url = '/products?';
        if (store.activeCategory) url += `category_id=${store.activeCategory}&`;
        if (search.value) url += `search=${search.value}&`;
        if (sortOrder.value !== 'default') url += `sort=${sortOrder.value}`;
        const res = await api.get(url);
        products.value = Array.isArray(res) ? res : (res.data || []);
        
        // Local sorting if backend doesn't support it yet
        if (sortOrder.value === 'price-asc') products.value.sort((a,b) => a.price - b.price);
        if (sortOrder.value === 'price-desc') products.value.sort((a,b) => b.price - a.price);
        if (sortOrder.value === 'name') products.value.sort((a,b) => a.name.localeCompare(b.name));
        
    } catch (e) {
        console.error("Fetch failed", e);
    } finally { loading.value = false; }
};

onMounted(async () => {
    try {
        const catRes = await api.get('/categories');
        categories.value = Array.isArray(catRes) ? catRes : catRes.data || [];
        await fetchDrops();
    } catch (e) { console.error(e); }
});

watch(() => store.activeCategory, () => { fetchDrops(); });
watch([search, sortOrder], () => { fetchDrops(); });

const openDetail = (p) => {
    store.selectedProduct = p;
    store.view = 'detail';
};

const getBadge = (p) => {
    if (p.stock <= 0) return { text: 'SOLD OUT', class: 'bs' };
    if (p.is_new) return { text: 'NEW', class: 'bn' };
    if (p.on_sale) return { text: 'SALE', class: 'bl' };
    return null;
};
</script>

<template>
  <div class="pg on">
    <!-- SHOP HEADER -->
    <div class="shop-top">
      <div>
        <div style="font-family:var(--font-d);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--w4);margin-bottom:8px">HOOD™ — CATALOG</div>
        <div class="shop-h">ALL<br>HOODIES</div>
      </div>
      <div class="shop-meta">
        <div class="shop-ct">— {{ products.length }} PRODUCTS</div>
        <div style="font-size:11px;color:var(--w4);margin-top:4px">Free shipping 500+ MAD</div>
        <div class="sh-search-box" style="margin-top: 15px; border-bottom: 1px solid var(--b2); width: 220px; margin-left: auto;">
          <input v-model="search" type="text" placeholder="SEARCH ARCHIVE //" style="width:100%; background:none; border:none; color:var(--w); font-family:var(--font-d); font-size:10px; padding:8px 0; outline:none; text-align: right;">
        </div>
      </div>
    </div>

    <!-- FILTER BAR -->
    <div class="fbar">
      <button class="fb" :class="{on: store.activeCategory === null}" @click="store.activeCategory = null">ALL</button>
      <div class="fsep"></div>
      <button v-for="c in categories" :key="c.id" class="fb" :class="{on: store.activeCategory === c.id}" @click="store.activeCategory = c.id">
        {{ c.name }}
      </button>
      <div class="fsep"></div>
      <select class="fsort" v-model="sortOrder">
        <option value="default">SORT: DEFAULT</option>
        <option value="price-asc">PRICE: LOW → HIGH</option>
        <option value="price-desc">PRICE: HIGH → LOW</option>
        <option value="name">A → Z</option>
      </select>
    </div>

    <!-- PRODUCTS GRID -->
    <div class="pg-grid pg-grid-auto" style="margin: 0;">
      <div v-if="loading" class="sh-load" style="grid-column: 1/-1; padding: 100px; text-align: center; font-family: var(--font-d); color: var(--w4);">SYNCING ARCHIVE...</div>
      <div v-else-if="products.length === 0" class="sh-empty" style="grid-column: 1/-1; padding: 100px; text-align: center; font-family: var(--font-d); color: var(--w4);">NO DROPS MATCH YOUR QUERY.</div>
      
      <div v-for="p in products" :key="p.id" class="pc" @click="openDetail(p)">
        <div class="pc-img">
          <div class="pc-img-inner">
            <img v-if="p.image_url" :src="p.image_url" @error="(e) => e.target.style.display='none'">
            <div v-else class="pp">{{ p.name.split(' ').slice(-1)[0] }}</div>
          </div>
          
          <!-- Badge -->
          <div v-if="getBadge(p)" :class="['pc-badge', getBadge(p).class]">{{ getBadge(p).text }}</div>
          
          <!-- Overlay -->
          <div class="pc-overlay">
             <div style="width:100%; text-align:center; font-family:var(--font-d); font-size:10px; letter-spacing:.1em; color:var(--w); margin-bottom:10px;">VIEW DROP //</div>
             <!-- In a real app we'd map sizes here -->
             <button v-for="s in ['S','M','L','XL']" :key="s" class="sq" @click.stop="openDetail(p)">{{ s }}</button>
          </div>
        </div>
        
        <div class="pc-info">
          <div>
            <div class="pc-name">{{ p.name }}</div>
            <div class="pc-sub">{{ p.category?.name || 'HOOD ORIGINALS' }}</div>
          </div>
          <div class="pc-price">
            <span v-if="p.old_price" class="pc-price-old" style="margin-right: 8px;">{{ p.old_price }} MAD</span>
            <span>{{ p.price }} MAD</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped overrides if necessary, but most is now in style.css */
.sh-load, .sh-empty {
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>

