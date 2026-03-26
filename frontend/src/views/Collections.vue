<script setup>
import { store } from '../store';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import voidCollectionImage from '../assests/colections/void.jpg';
import coreCollectionImage from '../assests/colections/core.jpg';
import statementCollectionImage from '../assests/colections/statement.jpg';
import washedCollectionImage from '../assests/colections/washed.jpg';
import archiveCollectionImage from '../assests/colections/archive.jpg';

const collectionsScrolled = ref(false);
const bentoRef = ref(null);
const router = useRouter();

const onPageScroll = () => {
    if (!bentoRef.value) return;
    const rect = bentoRef.value.getBoundingClientRect();
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
  router.push({ name: 'shop' });
};
</script>

<template>
  <div class="pg on">
    <div class="hero-sub-h" style="padding: 120px 40px 40px; border-bottom: 1px solid var(--b1);">
      <div style="font-family:var(--font-d); font-size:9px; letter-spacing:.24em; color:var(--w4); margin-bottom:18px;">HOOD™ — CATALOG // COLLECTIONS</div>
      <h1 style="font-family:var(--font-rock); font-size:clamp(38px, 8vw, 100px); text-transform:uppercase; line-height:.9;">ALL<br>DROPS</h1>
    </div>

    <div ref="bentoRef" class="bento" :class="{ 'is-scrolled': collectionsScrolled }">
      <div class="bc tall" @click="filterBy('VOID')">
        <div class="bc-bg"><img :src="voidCollectionImage" style="width:100%; height:100%; object-fit:cover;"></div>
        <div class="bc-name-center">VOID SERIES</div>
        <div class="bc-grad"></div>
        <div class="bc-info">
            <div class="bc-tag">Seasonal Drop — 2026</div>
            <div class="bc-name">VOID SERIES</div>
            <div style="font-size:10px; color:var(--w2); margin-bottom:15px; max-width:240px; line-height:1.5; letter-spacing:.02em;">NIGHT ARCHITECTURE. HIGH-CONTRAST TEXTURES AND SHADOW-PLAY FOR THE URBAN MIDNIGHT.</div>
            <button class="bc-cta">EXPLORE →</button>
        </div>
      </div>
      <div class="bc tall" @click="filterBy('CORE')">
        <div class="bc-bg"><img :src="coreCollectionImage" style="width:100%; height:100%; object-fit:cover;"></div>
        <div class="bc-name-center">CORE COLLECTION</div>
        <div class="bc-grad"></div>
        <div class="bc-info">
            <div class="bc-tag">Permanent Collection</div>
            <div class="bc-name">CORE COLLECTION</div>
            <div style="font-size:10px; color:var(--w2); margin-bottom:15px; max-width:240px; line-height:1.5; letter-spacing:.02em;">NATURAL SILHOUETTES. SOFT LIGHTING AND LUXURY HEAVYWEIGHT JERSEY. THE DAILY STANDARD.</div>
            <button class="bc-cta">EXPLORE →</button>
        </div>
      </div>
      <div class="bc tall" @click="filterBy('STATEMENT')">
        <div class="bc-bg"><img :src="statementCollectionImage" style="width:100%; height:100%; object-fit:cover;"></div>
        <div class="bc-name-center">STATEMENT SERIES</div>
        <div class="bc-grad"></div>
        <div class="bc-info">
            <div class="bc-tag">Graphic Series</div>
            <div class="bc-name">STATEMENT SERIES</div>
            <div style="font-size:10px; color:var(--w2); margin-bottom:15px; max-width:240px; line-height:1.5; letter-spacing:.02em;">HIGH-FLASH RIOT. RAW CONCRETE ENERGY AND AGGRESSIVE GRAPHIC MANIFESTOS.</div>
            <button class="bc-cta">EXPLORE →</button>
        </div>
      </div>
      <div class="bc tall" @click="filterBy('WASHED')">
        <div class="bc-bg"><img :src="washedCollectionImage" style="width:100%; height:100%; object-fit:cover;"></div>
        <div class="bc-name-center">WASHED EDITION</div>
        <div class="bc-grad"></div>
        <div class="bc-info">
            <div class="bc-tag">Washed Finishes</div>
            <div class="bc-name">WASHED EDITION</div>
            <div style="font-size:10px; color:var(--w2); margin-bottom:15px; max-width:240px; line-height:1.5; letter-spacing:.02em;">INDUSTRIAL GOLDEN HOUR. SUN-BLEACHED TEXTURES AND DISTRESSED VINTAGE PATINA.</div>
            <button class="bc-cta">EXPLORE →</button>
        </div>
      </div>
      <div class="bc wide" @click="filterBy('ARCHIVE')">
        <div class="bc-bg"><img :src="archiveCollectionImage" style="width:100%; height:100%; object-fit:cover;"></div>
        <div class="bc-name-center">ARCHIVE REEDITION</div>
        <div class="bc-grad"></div>
        <div class="bc-info">
            <div class="bc-tag">Reedition — Last Sizes</div>
            <div class="bc-name">ARCHIVE REEDITION</div>
            <div style="font-size:10px; color:var(--w2); margin-bottom:15px; max-width:400px; line-height:1.5; letter-spacing:.02em;">VAULT SCANS. LO-FI 90S FILM GRAIN AND THE ORIGINAL SEED PIECES OF THE UNIVERSE.</div>
            <button class="bc-cta">EXPLORE →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles removed - now handled by global style.css */
</style>

