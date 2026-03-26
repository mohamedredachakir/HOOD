<script setup>
import { store } from '../store';
import { onMounted, ref } from 'vue';
import { api } from '../api';
import OrderModal from '../components/OrderModal.vue';

const products = ref([]);
const orders = ref([]);
const users = ref([]);
const categories = ref([]);
const editCat = ref(null);
const activeTab = ref('inventory');
const imageFile = ref(null);
const imagePreview = ref('');
const showProductModal = ref(false);
const editingProduct = ref(null);
const selectedOrder = ref(null);
const showOrderModal = ref(false);
const MAX_IMAGE_SIZE_MB = 8;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ACCEPTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const newProd = ref({ name: '', price: '', category_id: 1, description: '', stock_quantity: 50 });
const newCat = ref({ name: '' });

const confirmModal = ref(null); // { title, message, data, action }
const showConfirm = ref(false);

const handleAuthFailure = (error) => {
  const status = error?.status || error?.response?.status;
  if (status === 401 || status === 403) {
    store.addToast('Admin session expired or unauthorized. Please login again.', 'error');
    store.logout();
    store.view = 'auth';
    return true;
  }
  return false;
};

const fetchAll = async () => {
  const [pRes, oRes, uRes, cRes] = await Promise.allSettled([
    api.get('/products'),
    api.get('/orders'),
    api.get('/users'),
    api.get('/categories')
  ]);

  if (pRes.status === 'fulfilled') {
    const rawProducts = pRes.value.data || pRes.value;
    products.value = Array.isArray(rawProducts) ? rawProducts : [];
    // Validate all products have id field
    if (products.value.length > 0 && !products.value[0].id) {
      console.warn('WARNING: Products loaded without ID field', products.value[0]);
    }
  }

  if (oRes.status === 'fulfilled') {
    orders.value = oRes.value.data || oRes.value;
  }

  if (uRes.status === 'fulfilled') {
    users.value = Array.isArray(uRes.value) ? uRes.value : (uRes.value.data || []);
  }

  if (cRes.status === 'fulfilled') {
    categories.value = Array.isArray(cRes.value) ? cRes.value : (cRes.value.data || []);
  }

  const authRejected = [pRes, oRes, uRes].find(
    (r) => r.status === 'rejected' && [401, 403].includes(r.reason?.status || r.reason?.response?.status)
  );

  if (authRejected) {
    handleAuthFailure(authRejected.reason);
    return;
  }

  if (pRes.status === 'rejected') store.addToast('Cannot load products.', 'error');
  if (oRes.status === 'rejected') store.addToast('Cannot load orders.', 'error');
  if (uRes.status === 'rejected') store.addToast('Cannot load users (admin check).', 'error');
  if (cRes.status === 'rejected') store.addToast('Cannot load categories.', 'error');
};

onMounted(fetchAll);

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) {
    imageFile.value = null;
    imagePreview.value = '';
    return;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    imageFile.value = null;
    imagePreview.value = '';
    e.target.value = '';
    store.addToast(`Image too large. Max ${MAX_IMAGE_SIZE_MB}MB allowed.`, 'error');
    return;
  }

  if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
    imageFile.value = null;
    imagePreview.value = '';
    e.target.value = '';
    store.addToast(`Unsupported image format. Use ${ACCEPTED_IMAGE_EXTENSIONS.join(', ')}.`, 'error');
    return;
  }

  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const openProductModal = (product = null) => {
  try {
    resetForm();
  } catch (err) {
    showProductModal.value = true; // Open anyway
    return;
  }
  
  if (product && product.id) {
    editingProduct.value = { ...product };
    newProd.value = {
      name: product.name || '',
      price: product.price ?? '',
      category_id: product.category_id || categories.value[0]?.id || null,
      description: product.description || '',
      stock_quantity: product.stock_quantity ?? product.stock ?? 0,
    };
    imagePreview.value = product.image_url || '';
  } else if (product && !product.id) {
    store.addToast('ERROR: Product missing ID. Reload page and try again.', 'error');
    return;
  }
  
  showProductModal.value = true;
};

const closeProductModal = () => {
  showProductModal.value = false;
  resetForm();
};

const resetForm = () => {
    editingProduct.value = null;
    imageFile.value = null;
    imagePreview.value = '';
    const defaultCategoryId = categories.value && categories.value.length > 0 ? categories.value[0].id : null;
    newProd.value = { 
        name: '', 
        price: '', 
        category_id: defaultCategoryId, 
        description: '', 
        stock_quantity: 50 
    };
    const fileIn = document.querySelector('.file-lux');
    if (fileIn) fileIn.value = '';
};

const save = async () => {
    try {
        const fd = new FormData();
    const data = newProd.value;

    if (!data.name?.trim()) {
      store.addToast('Product name is required.', 'error');
      return;
    }
    if (data.price === '' || data.price === null || Number(data.price) < 0) {
      store.addToast('Price must be a valid number.', 'error');
      return;
    }
    if (data.stock_quantity === '' || data.stock_quantity === null || Number(data.stock_quantity) < 0) {
      store.addToast('Stock quantity must be a valid number.', 'error');
      return;
    }
        
        // Ensure category_id is set
        if (!data.category_id && categories.value.length > 0) {
            data.category_id = categories.value[0].id;
        }

    if (!data.category_id) {
      store.addToast('Please create/select a category first.', 'error');
      return;
    }

        // Send both stock and stock_quantity to be bulletproof
        const keys = ['name', 'price', 'description', 'stock_quantity', 'category_id'];
        keys.forEach(k => {
            if (data[k] !== undefined && data[k] !== null) {
                fd.append(k, data[k]);
                if (k === 'stock_quantity') fd.append('stock', data[k]);
            }
        });
        
        if (imageFile.value) fd.append('image', imageFile.value);

        const editingId = Number(editingProduct.value?.id);
        if (Number.isInteger(editingId) && editingId > 0) {
          await api.post(`/products/${editingId}?_method=PUT`, fd);
        } else {
          await api.post('/products', fd);
        }
        
        store.addToast('SUCCESS: INVENTORY UPDATED.');
        await fetchAll();
        closeProductModal();
    } catch (e) { 
      if (handleAuthFailure(e)) return;
        const msg = e.response?.data?.message || e.message;
        const suggestion = e.response?.data?.suggestion ? ` | ${e.response.data.suggestion}` : '';
        const errors = e.response?.data?.errors;
        
        if (errors) {
            Object.values(errors).flat().forEach(err => store.addToast(err, 'error'));
        } else if (msg === 'Failed to fetch') {
          store.addToast(`UPLOAD FAULT (CONNECTION ERROR). Check if backend is active and image stays under ${MAX_IMAGE_SIZE_MB}MB. If you are developing locally, check api.js URL.`, 'error');
        } else {
            store.addToast(`${msg}${suggestion}`, 'error');
        }
    }
};

const del = async (id) => {
  if (!id) {
    store.addToast('Cannot delete: invalid product ID.', 'error');
    return;
  }

    confirmModal.value = {
        title: 'REMOVE DROP',
        message: 'PERMANENTLY REMOVE THIS PRODUCT FROM YOUR ARCHIVE?',
        data: id,
        action: 'delete-product'
    };
    showConfirm.value = true;
};

const delCat = async (id) => {
    confirmModal.value = {
        title: 'DELETE SERIES',
        message: 'PERMANENTLY DELETE THIS COLLECTION SERIES? ALL PRODUCTS IN IT MAY BE AFFECTED.',
        data: id,
        action: 'delete-category'
    };
    showConfirm.value = true;
};

const confirmDelete = async () => {
    try {
        if (confirmModal.value.action === 'delete-product') {
            await api.delete(`/products/${confirmModal.value.data}`);
            store.addToast('DROP ARCHIVED.');
        } else if (confirmModal.value.action === 'delete-category') {
            await api.delete(`/categories/${confirmModal.value.data}`);
            store.addToast('SERIES REMOVED.');
        }
        await fetchAll();
        showConfirm.value = false;
        confirmModal.value = null;
    } catch (e) {
      if (handleAuthFailure(e)) return;
        store.addToast(e.message, 'error');
    }
};

const openOrderModal = (order) => {
    selectedOrder.value = order;
    showOrderModal.value = true;
};

const closeOrderModal = () => {
    showOrderModal.value = false;
    selectedOrder.value = null;
    // Refresh orders when modal closes
    fetchAll();
};

const onOrderStatusUpdated = () => {
    fetchAll();
};

const saveCat = async () => {
    try {
        const data = editCat.value || newCat.value;
        const cleanData = { name: data.name };
        
        if(editCat.value) await api.put(`/categories/${editCat.value.id}`, cleanData);
        else await api.post('/categories', cleanData);
        
        await fetchAll();
        editCat.value = null;
        newCat.value = { name: '' };
        store.addToast('CATEGORY ARCHIVED.');
    } catch (e) { store.addToast(e.message, 'error'); }
};
</script>

<template>
  <div class="pg on">
    <div class="adm-wrap">
      <div class="adm-side">
         <div class="adm-logo">HOOD™ STUDIO</div>
         <nav class="adm-nav">
            <button class="adm-nl" :class="{on: activeTab === 'inventory'}" @click="activeTab = 'inventory'">Inventory</button>
            <button class="adm-nl" :class="{on: activeTab === 'orders'}" @click="activeTab = 'orders'">Orders</button>
            <button class="adm-nl" :class="{on: activeTab === 'customers'}" @click="activeTab = 'customers'">Customers</button>
            <button class="adm-nl" :class="{on: activeTab === 'categories'}" @click="activeTab = 'categories'">Categories</button>
            <div class="nav-sep"></div>
            <button class="adm-nl" @click="store.view = 'home'">Exit Dashboard</button>
         </nav>
      </div>
      
      <div class="adm-main">
         <div class="adm-stats-row">
            <div class="stat-lux-box"><div class="stat-l">ARCHIVE DROP</div><div class="stat-v">{{ products.length }} DROPS</div></div>
            <div class="stat-lux-box"><div class="stat-l">SHIPMENTS</div><div class="stat-v">{{ orders.length }} ACTIVE</div></div>
            <div class="stat-lux-box mini-cat-p">
               <div class="stat-l">STUDIO SERIES</div>
               <div class="mini-cat-list">
                  <span v-for="c in categories.slice(0,3)" :key="c.id" class="m-cat-tag">{{ c.name }}</span>
                  <span v-if="categories.length > 3" class="m-cat-tag">+ {{ categories.length - 3 }}</span>
               </div>
            </div>
         </div>

         <div v-if="activeTab === 'inventory'">
             <div class="adm-hdr">
                <div><div class="label">— DROP STUDIO</div><h1 class="acc-h">COLLECTION ARCHIVE</h1></div>
             <button class="btn-add" @click="openProductModal()">+ ADD NEW DROP</button>
             </div>
           <div class="adm-list-container">
              <div v-for="p in products" :key="p.id" class="p-card-lux" @click="openProductModal(p)">
                      <div class="p-card-lux-img">
                         <img v-if="p.image_url" :src="p.image_url">
                      </div>
                      <div class="p-card-lux-info"><div class="p-lux-name">{{ p.name }}</div><div class="p-lux-meta">MAD {{ p.price }} • {{ p.stock_quantity }} QTY</div></div>
                      <button class="p-lux-del" @click.stop="del(p.id)">×</button>
                   </div>
             </div>
         </div>

         <div v-else-if="activeTab === 'orders'">
             <div class="adm-hdr"><div><div class="label">— LOGISTICS</div><h1 class="acc-h">ACTIVE SHIPMENTS</h1></div></div>
             <div class="order-list-lux">
            <div v-for="o in orders" :key="o.id" class="o-lux-row" @click="openOrderModal(o)">
                   <div class="o-lux-id">#{{ o.id }}</div>
                   <div class="o-lux-user">{{ o.user?.name }}</div>
                   <div class="o-lux-items"><span v-for="i in o.items" :key="i.id" class="o-tag">{{ i.product?.name }} x{{ i.quantity }}</span></div>
                   <div class="o-lux-total">{{ o.total_amount }} MAD</div>
                   <div class="o-status"><span class="o-st-pill" :class="o.status">{{ o.status }}</span></div>
                </div>
             </div>
         </div>

         <div v-else-if="activeTab === 'customers'">
             <div class="adm-hdr"><div><div class="label">— CRM</div><h1 class="acc-h">STREET COMMUNITY</h1></div></div>
             <div class="usr-lux-grid">
                <div v-for="u in users" :key="u.id" class="u-lux-card">
                   <div class="u-lux-avatar">{{ u.name[0] }}</div>
                   <div class="u-lux-info">
                      <div class="u-lux-name">{{ u.name }}</div>
                      <div class="u-lux-e">{{ u.email }}</div>
                      <div class="u-lux-phone">{{ u.phone || 'N/A' }}</div>
                   </div>
                   <div class="u-lux-role" :class="u.role">{{ u.role }}</div>
                </div>
             </div>
         </div>

         <div v-else-if="activeTab === 'categories'">
             <div class="adm-hdr"><div><div class="label">— TAXONOMY</div><h1 class="acc-h">COLLECTION SERIES</h1></div></div>
             <div class="adm-body-grid">
                <div class="adm-list-container">
                   <div v-for="c in categories" :key="c.id" class="p-card-lux" :class="{selected: editCat?.id === c.id}" @click="editCat = {...c}">
                      <div class="p-lux-name">{{ c.name }}</div>
                      <button class="p-lux-del" @click.stop="delCat(c.id)">×</button>
                   </div>
                </div>
                <div class="adm-editor-container">
                   <div class="ed-lux-box">
                      <div class="ed-lux-h">{{ editCat ? 'REFINE SERIES' : 'NEW SERIES DROP' }}</div>
                      <div class="fl-group"><label class="fl-lux-lbl">LABEL NAME</label><input v-model="(editCat || newCat).name" class="fi-lux" type="text" placeholder="e.g. STUDIO WEAR"></div>
                      <button class="btn-publish" @click="saveCat">{{ editCat ? 'UPDATE SERIES →' : 'PUBLISH SERIES →' }}</button>
                      <button v-if="editCat" class="btn-cancel-lux" @click="editCat = null">CANCEL</button>
                   </div>
                </div>
             </div>
         </div>
      </div>
    </div>

    <!-- CONFIRMATION MODAL -->
    <div v-if="showConfirm" class="confirm-modal-overlay" @click.self="showConfirm = false">
      <div class="confirm-modal">
        <div class="confirm-header">
          <h2 class="confirm-title">{{ confirmModal?.title }}</h2>
          <button class="confirm-close" @click="showConfirm = false">✕</button>
        </div>
        <div class="confirm-body">
          <p class="confirm-message">{{ confirmModal?.message }}</p>
        </div>
        <div class="confirm-footer">
          <button class="confirm-cancel" @click="showConfirm = false">CANCEL</button>
          <button class="confirm-delete" @click="confirmDelete">DELETE</button>
        </div>
      </div>
    </div>

    <!-- ORDER MODAL -->
    <OrderModal 
      v-if="showOrderModal && selectedOrder"
      :order="selectedOrder"
      @close="closeOrderModal"
      @status-updated="onOrderStatusUpdated"
    />

    <!-- PRODUCT MODAL -->
    <div v-if="showProductModal" class="product-modal-overlay" @click.self="closeProductModal">
      <div class="product-modal">
        <div class="confirm-header">
          <h2 class="confirm-title">{{ editingProduct ? 'REFINE DROP' : 'NEW STUDIO DROP' }}</h2>
          <button class="confirm-close" @click="closeProductModal">✕</button>
        </div>

        <div class="product-modal-body">
          <div class="fl-group"><label class="fl-lux-lbl">DESIGN NAME</label><input v-model="newProd.name" class="fi-lux" type="text"></div>
          <div class="fl-grid-2">
            <div class="fl-group"><label class="fl-lux-lbl">PRICE (MAD)</label><input v-model="newProd.price" class="fi-lux" type="number"></div>
            <div class="fl-group"><label class="fl-lux-lbl">STOCK QTY</label><input v-model="newProd.stock_quantity" class="fi-lux" type="number"></div>
          </div>
          <div class="fl-group">
            <label class="fl-lux-lbl">SELECT SERIES</label>
            <select v-model="newProd.category_id" class="fi-lux select-lux">
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="fl-group">
            <label class="fl-lux-lbl">DROP VISUAL</label>
            <input type="file" @change="onFileChange" class="fi-lux file-lux" accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp">
            <div v-if="imagePreview" class="img-preview-wrap">
              <img :src="imagePreview" alt="Selected preview" class="img-preview" />
            </div>
          </div>
          <div class="fl-group"><label class="fl-lux-lbl">MANIFESTO</label><textarea v-model="newProd.description" class="fi-lux ft-lux"></textarea></div>
        </div>

        <div class="confirm-footer">
          <button class="confirm-cancel" @click="closeProductModal">CANCEL</button>
          <button class="btn-publish" style="margin-top: 0;" @click="save">{{ editingProduct ? 'CONFIRM CHANGES →' : 'PUBLISH DROP →' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.adm-wrap { display: flex; min-height: 100vh; background: var(--void); color: var(--w); }
.adm-side { width: 220px; border-right: 1px solid var(--b1); padding: 50px 30px; position: sticky; top: 0; height: 100vh; z-index: 10; }
.adm-logo { font-family: var(--font-d); font-size: 14px; letter-spacing: .25em; margin-bottom: 72px; }
.adm-nav { display: flex; flex-direction: column; gap: 14px; }
.adm-nl { text-align: left; font-size: 11px; color: var(--w4); letter-spacing: .12em; transition: 0.3s; background: none; border: none; cursor: pointer;}
.adm-nl:hover, .adm-nl.on { color: var(--w); }
.nav-sep { height: 1px; background: var(--b1); margin: 20px 0; }

.adm-main { flex: 1; padding: 50px 60px; max-width: 1400px; }
.adm-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 60px; }
.stat-lux-box { background: var(--s1); border: 1px solid var(--b1); padding: 24px; }
.stat-l { font-family: var(--font-d); font-size: 8px; color: var(--w4); letter-spacing: .25em; margin-bottom: 12px; }
.stat-v { font-family: var(--font-d); font-size: 18px; color: var(--w); }

.mini-cat-list { display: flex; gap: 8px; flex-wrap: wrap; }
.m-cat-tag { font-size: 9px; color: var(--acc); border: 1px solid var(--acc); padding: 2px 6px; }

.adm-hdr { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 56px; }
.btn-add { background: var(--w); color: var(--void); font-family: var(--font-d); font-size: 10px; padding: 12px 24px; border: none; cursor: pointer;}

.adm-body-grid { display: grid; grid-template-columns: 1fr 400px; gap: 60px; align-items: start; }
.adm-list-container { display: flex; flex-direction: column; gap: 1px; background: var(--b1); border: 1px solid var(--b1); }

.p-card-lux { background: var(--void); display: flex; align-items: center; padding: 18px 24px; gap: 24px; cursor: pointer; position: relative; transition: .2s; height: 100%; min-height: 80px;}
.p-card-lux:hover, .p-card-lux.selected { background: var(--s1); }
.p-card-lux-img { width: 64px; aspect-ratio: 3/4; background: var(--s2); overflow: hidden; }
.p-card-lux-img img { width: 100%; height: 100%; object-fit: cover; }
.p-lux-name { font-family: var(--font-d); font-size: 11px; text-transform: uppercase; margin-bottom: 4px; }
.p-lux-meta { font-size: 10px; color: var(--w4); font-family: var(--font-d); }
.p-lux-del { position: absolute; right: 24px; color: var(--red); font-size: 20px; opacity: 0; transition: .2s; background: none; border: none; cursor: pointer;}
.p-card-lux:hover .p-lux-del { opacity: 1; }

.ed-lux-box { background: var(--s1); padding: 40px; border: 1px solid var(--b1); position: sticky; top: 40px; }
.ed-lux-h { font-family: var(--font-d); font-size: 14px; margin-bottom: 32px; letter-spacing: .2em; border-left: 2px solid var(--acc); padding-left: 16px; }
.fl-group { margin-bottom: 24px; }
.fl-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.fl-lux-lbl { display: block; font-family: var(--font-d); font-size: 9px; color: var(--w4); letter-spacing: .15em; margin-bottom: 10px; }
.fi-lux { width: 100%; background: var(--s2); border: 1px solid var(--b2); color: var(--w); padding: 14px 16px; font-family: var(--font-b); font-size: 13px; outline: none; transition: .25s; }
.fi-lux:focus { border-color: var(--w); background: var(--void); }
.ft-lux { min-height: 100px; resize: vertical; line-height: 1.6; }
.btn-publish { width: 100%; background: var(--w); color: var(--void); font-family: var(--font-d); font-size: 11px; padding: 18px; letter-spacing: .12em; margin-top: 12px; border: none; cursor: pointer;}
.btn-publish:hover { background: var(--acc); }
.btn-cancel-lux { width: 100%; font-size: 10px; color: var(--w3); margin-top: 16px; letter-spacing: .1em; cursor: pointer; background: none; border: none;}

.order-list-lux { display: flex; flex-direction: column; gap: 1px; background: var(--b1); border: 1px solid var(--b1); }
.o-lux-row { display: grid; grid-template-columns: 120px 200px 1fr 120px 120px; background: var(--void); padding: 24px; align-items: center; font-size: 12px; transition: all 0.2s ease; border-bottom: 1px solid var(--b1); }
.o-lux-row:hover { background: var(--s1); border-color: var(--acc); }
.o-lux-id { font-family: var(--font-d); color: var(--acc); }
.o-tag { display: inline-block; background: var(--s2); padding: 3px 8px; margin: 2px; border: 1px solid var(--b1); font-size: 9px; }
.o-lux-total { font-family: var(--font-d); font-weight: 700; }
.o-status { text-align: center; }
.o-st-pill { font-size: 9px; font-family: var(--font-d); padding: 4px 10px; border: 1px solid var(--b2); text-transform: uppercase;}

/* ── USER CARD ── */
.usr-lux-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.u-lux-card { background: var(--void); border: 1px solid var(--b2); padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
.u-lux-card:hover { background: var(--s1); border-color: var(--w3); }
.u-lux-avatar { width: 48px; height: 48px; background: var(--acc); color: var(--void); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-d); font-size: 18px; font-weight: bold; flex-shrink: 0; }
.u-lux-info { flex: 1; min-width: 0; }
.u-lux-name { font-family: var(--font-d); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
.u-lux-e { font-size: 11px; color: var(--w3); margin-bottom: 4px; word-break: break-all; }
.u-lux-phone { font-size: 10px; color: var(--w4); font-family: var(--font-d); letter-spacing: 0.05em; }
.u-lux-role { font-family: var(--font-d); font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 10px; border: 1px solid var(--b2); }
.u-lux-role.admin { border-color: var(--acc); color: var(--acc); }

/* ── CONFIRMATION MODAL ── */
.confirm-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 5, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.25s ease;
}

.confirm-modal {
  background: var(--s1);
  border: 1px solid var(--b2);
  max-width: 450px;
  width: 90%;
  animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px;
  border-bottom: 1px solid var(--b2);
}

.confirm-title {
  font-family: var(--font-rock);
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.confirm-close {
  font-size: 24px;
  color: var(--w3);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
  background: none;
  border: none;
}

.confirm-close:hover {
  color: var(--w);
}

.confirm-body {
  padding: 28px 24px;
}

.confirm-message {
  font-family: var(--font-d);
  font-size: 12px;
  letter-spacing: 0.06em;
  line-height: 1.8;
  color: var(--w2);
  margin: 0;
  text-transform: uppercase;
}

.confirm-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--b2);
}

.confirm-cancel {
  flex: 1;
  background: transparent;
  border: 1px solid var(--b2);
  color: var(--w3);
  font-family: var(--font-d);
  font-size: 11px;
  letter-spacing: 0.12em;
  padding: 14px 20px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.15s;
}

.confirm-cancel:hover {
  border-color: var(--w);
  color: var(--w);
}

.confirm-delete {
  flex: 1;
  background: var(--red);
  border: 1px solid var(--red);
  color: var(--w);
  font-family: var(--font-d);
  font-size: 11px;
  letter-spacing: 0.12em;
  padding: 14px 20px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.15s;
}

.confirm-delete:hover {
  background: var(--red2);
  border-color: var(--red);
  opacity: 0.9;
}

.product-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 5, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1400;
}

.product-modal {
  background: var(--s1);
  border: 1px solid var(--b2);
  width: min(640px, 92vw);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.product-modal-body {
  padding: 24px;
  overflow-y: auto;
}

.img-preview-wrap {
  margin-top: 12px;
  border: 1px solid var(--b2);
  background: var(--void);
  padding: 8px;
}

.img-preview {
  width: 100%;
  max-height: 260px;
  object-fit: contain;
  display: block;
}
</style>
