<script setup>
import { store } from '../store';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import heroHomeImage from '../assests/hero_home.jpg';
import voidCollectionImage from '../assests/colections/void.jpg';
import coreCollectionImage from '../assests/colections/core.jpg';
import statementCollectionImage from '../assests/colections/statement.jpg';
import washedCollectionImage from '../assests/colections/washed.jpg';
import archiveCollectionImage from '../assests/colections/archive.jpg';

const heroImageUrl = heroHomeImage;
const collectionsScrolled = ref(false);
const bentoRef = ref(null);

const onPageScroll = () => {
  if (!bentoRef.value) return;
  const rect = bentoRef.value.getBoundingClientRect();
  // Keep centered titles visible longer, then collapse when section is deeply scrolled.
  const holdCenterUntil = Math.max(320, Math.round(window.innerHeight * 0.45));
  collectionsScrolled.value = rect.top <= -holdCenterUntil;
};

onMounted(() => {
  onPageScroll();
  window.addEventListener('scroll', onPageScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onPageScroll);
});

const filterBy = (name) => {
    const cat = store.categories.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
    if (cat) store.activeCategory = cat.id;
    else store.activeCategory = null;
    store.view = 'shop';
    window.scrollTo(0,0);
};
</script>

<template>
  <div class="pg on">
    <!-- HERO SECTION -->
    <section class="hero">
      <div class="hero-noise"></div>
      <div class="hero-line"></div><div class="hero-line"></div><div class="hero-line"></div><div class="hero-line"></div>
      <div class="hero-bg-wrap">
        <img class="hero-bg-img" :src="heroImageUrl" alt="HOOD hero background">
      </div>
      <div class="hero-ghost">HOOD™</div>
      <div class="hero-body">
        <div>
          <h1 class="hero-h1">THE<br>ONLY<br>HOODIE<br>YOU NEED.</h1>
          <p class="hero-sub">One Brand &nbsp;·&nbsp; One Product &nbsp;·&nbsp; No Compromise</p>
        </div>
        <div class="hero-actions">
          <p class="hero-scroll">↓ Scroll</p>
          <button class="btn-cta" @click="store.view = 'shop'">SHOP ALL →</button>
          <button class="btn-out" @click="store.view = 'collections'">COLLECTIONS</button>
        </div>
      </div>
    </section>

    <!-- MARQUEE -->
    <div class="mq"><div class="mq-inner">
      <span class="mq-seg">HOOD™</span><span class="mq-dot">///</span>
      <span class="mq-seg">380GSM FRENCH TERRY</span><span class="mq-dot">///</span>
      <span class="mq-seg">DEAD STOCK MENTALITY</span><span class="mq-dot">///</span>
      <span class="mq-seg">WORN FOREVER</span><span class="mq-dot">///</span>
      <span class="mq-seg">CRAFTED SLOW</span><span class="mq-dot">///</span>
      <span class="mq-seg">LIMITED DROPS</span><span class="mq-dot">///</span>
      <span class="mq-seg">HOOD™</span><span class="mq-dot">///</span>
      <span class="mq-seg">380GSM FRENCH TERRY</span><span class="mq-dot">///</span>
      <span class="mq-seg">DEAD STOCK MENTALITY</span><span class="mq-dot">///</span>
      <span class="mq-seg">WORN FOREVER</span><span class="mq-dot">///</span>
      <span class="mq-seg">CRAFTED SLOW</span><span class="mq-dot">///</span>
      <span class="mq-seg">LIMITED DROPS</span><span class="mq-dot">///</span>
    </div></div>

    <!-- FEATURED DROPS -->
    <section class="sec">
      <div class="sec-hdr">
        <div>
          <div class="sec-label">Latest Drop</div>
          <div class="sec-title">VOID SERIES 002</div>
        </div>
        <button class="lnk-all" @click="store.view = 'shop'">VIEW ALL →</button>
      </div>

      <div class="pg-grid pg-grid-4">
        <div v-for="p in store.products.slice(0, 4)" :key="p.id" class="pc" @click="store.selectedProduct = p; store.view = 'detail'">
          <div class="pc-img">
            <div class="pc-img-inner">
                 <img v-if="p.image_url" :src="p.image_url" :alt="p.name">
                 <div v-else class="pp">{{ p.name.split(' ').slice(-1)[0] }}</div>
            </div>
            <div v-if="p.stock <= 0" class="pc-badge bs">SOLD OUT</div>
            <div v-else-if="p.is_new" class="pc-badge bn">NEW</div>
            
            <div class="pc-overlay">
                <div style="width:100%; text-align:center; font-family:var(--font-d); font-size:10px; letter-spacing:.1em; color:var(--w); margin-bottom:10px;">VIEW DROP //</div>
                <button v-for="size in ['S', 'M', 'L', 'XL']" :key="size" class="sq" @click.stop="store.selectedProduct = p; store.view = 'detail'">
                    {{ size }}
                </button>
            </div>
          </div>
          <div class="pc-info">
            <div>
              <div class="pc-name">{{ p.name }}</div>
              <div class="pc-sub">{{ p.category?.name || 'HOOD ORIGINALS' }}</div>
            </div>
            <div class="pc-price">{{ p.price }} MAD</div>
          </div>
        </div>
      </div>
    </section>

    <!-- COLLECTIONS BENTO -->
    <section class="sec-sm" style="padding-top:0">
      <div class="sec-hdr">
          <div class="sec-label" style="font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--w)">Collections</div>
          <button class="lnk-all" @click="store.view = 'collections'">ALL →</button>
      </div>
        <div ref="bentoRef" class="bento" :class="{ 'is-scrolled': collectionsScrolled }">
        <div class="bc tall" @click="filterBy('VOID')">
          <div class="bc-bg"><img :src="voidCollectionImage" style="width:100%; height:100%; object-fit:cover;"></div>
          <div class="bc-name-center">VOID SERIES</div>
            <div class="bc-grad"></div>
            <div class="bc-info"><div class="bc-tag">Seasonal Drop — 2026</div><div class="bc-name">VOID SERIES</div><button class="bc-cta">EXPLORE →</button></div>
        </div>
        <div class="bc tall" @click="filterBy('CORE')">
          <div class="bc-bg"><img :src="coreCollectionImage" style="width:100%; height:100%; object-fit:cover;"></div>
          <div class="bc-name-center">CORE COLLECTION</div>
            <div class="bc-grad"></div>
            <div class="bc-info"><div class="bc-tag">Permanent Collection</div><div class="bc-name">CORE COLLECTION</div><button class="bc-cta">EXPLORE →</button></div>
        </div>
        <div class="bc tall" @click="filterBy('STATEMENT')">
          <div class="bc-bg"><img :src="statementCollectionImage" style="width:100%; height:100%; object-fit:cover;"></div>
          <div class="bc-name-center">STATEMENT SERIES</div>
            <div class="bc-grad"></div>
            <div class="bc-info"><div class="bc-tag">Graphic Series</div><div class="bc-name">STATEMENT SERIES</div><button class="bc-cta">EXPLORE →</button></div>
        </div>
        <div class="bc tall" @click="filterBy('WASHED')">
          <div class="bc-bg"><img :src="washedCollectionImage" style="width:100%; height:100%; object-fit:cover;"></div>
          <div class="bc-name-center">WASHED EDITION</div>
            <div class="bc-grad"></div>
            <div class="bc-info"><div class="bc-tag">Washed Finishes</div><div class="bc-name">WASHED EDITION</div><button class="bc-cta">EXPLORE →</button></div>
        </div>
        <div class="bc wide" @click="filterBy('ARCHIVE')">
          <div class="bc-bg"><img :src="archiveCollectionImage" style="width:100%; height:100%; object-fit:cover;"></div>
          <div class="bc-name-center">ARCHIVE REEDITION</div>
            <div class="bc-grad"></div>
            <div class="bc-info" style="display:flex; justify-content:space-between; align-items:flex-end">
                <div><div class="bc-tag">Reedition — Last Sizes</div><div class="bc-name">ARCHIVE REEDITION</div><button class="bc-cta">EXPLORE →</button></div>
                <div style="font-family:var(--font-d); font-size:9px; letter-spacing:.14em; color:var(--w3); text-align:right">FINAL UNITS<br>AVAILABLE</div>
            </div>
        </div>
      </div>
    </section>

    <!-- MANIFESTO -->
    <div class="mani">
      <div class="mani-eye">— Our Belief —</div>
      <p class="mani-body">
        We don't make collections.<br />
        <span class="mani-dim">We make the hoodie.</span><br />
        Heavier than you expect.<br />
        <span class="mani-dim">Simpler than you think.</span><br />
        Built to last longer than<br />
        <span class="mani-dim">the trends that never mattered.</span>
      </p>
    </div>
  </div>
</template>


