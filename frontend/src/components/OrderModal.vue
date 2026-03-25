<script setup>
import { ref } from 'vue';
import { store } from '../store';

const props = defineProps({
    order: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close', 'status-updated']);

const updating = ref(false);
const statusOptions = ['pending', 'confirmed', 'delivered', 'rejected'];

const updateStatus = async (newStatus) => {
    if (updating.value) return;
    
    updating.value = true;
    try {
        await store.updateOrderStatus(props.order.id, newStatus);
        props.order.status = newStatus;
        store.addToast(`Order status updated to ${newStatus}`);
        emit('status-updated', newStatus);
    } catch (e) {
        store.addToast(e.message || 'Failed to update order status', 'error');
    } finally {
        updating.value = false;
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>

<template>
    <div class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content">
            <div class="modal-header">
                <div>
                    <h2 class="modal-title">ORDER #{{ order.id }}</h2>
                    <div class="modal-date">{{ formatDate(order.created_at) }}</div>
                </div>
                <button class="modal-close" @click="emit('close')">✕</button>
            </div>

            <div class="modal-body">
                <!-- Client Information -->
                <div class="section">
                    <div class="section-label">CLIENT INFORMATION</div>
                    <div class="client-info">
                        <div class="info-item">
                            <div class="info-label">NAME</div>
                            <div class="info-value">{{ order.user?.name }}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">PHONE</div>
                            <div class="info-value">{{ order.phone || order.user?.phone || 'N/A' }}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">EMAIL</div>
                            <div class="info-value">{{ order.user?.email }}</div>
                        </div>
                    </div>
                </div>

                <!-- Products -->
                <div class="section">
                    <div class="section-label">ITEMS ({{ order.items?.length }})</div>
                    <div class="items-container">
                        <div v-for="item in order.items" :key="item.id" class="item-row">
                            <div class="item-name">{{ item.product?.name }}</div>
                            <div class="item-qty">x{{ item.quantity }}</div>
                            <div class="item-price">{{ item.price }} MAD</div>
                            <div class="item-total">{{ item.price * item.quantity }} MAD</div>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="section">
                    <div class="summary-row">
                        <div class="summary-label">TOTAL AMOUNT</div>
                        <div class="summary-value">{{ order.total_amount }} MAD</div>
                    </div>
                </div>

                <!-- Status Management -->
                <div class="section">
                    <div class="section-label">ORDER STATUS</div>
                    <div class="status-display">{{ order.status?.toUpperCase() }}</div>
                    <div class="status-buttons">
                        <button 
                            v-for="status in statusOptions" 
                            :key="status"
                            class="status-btn"
                            :class="[{ active: order.status === status }, status]"
                            @click="updateStatus(status)"
                            :disabled="updating || order.status === status"
                        >
                            {{ status.toUpperCase() }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-close" @click="emit('close')">CLOSE</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(5, 5, 5, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
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

.modal-content {
    background: var(--s1);
    border: 1px solid var(--b2);
    max-width: 550px;
    width: 90%;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border-radius: 2px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 32px 32px 24px;
    border-bottom: 1px solid var(--b2);
}

.modal-title {
    font-family: var(--font-d);
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 0 0 8px 0;
    color: var(--acc);
}

.modal-date {
    font-size: 10px;
    color: var(--w4);
    font-family: var(--font-d);
    letter-spacing: 0.05em;
}

.modal-close {
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

.modal-close:hover {
    color: var(--w);
}

.modal-body {
    overflow-y: auto;
    flex: 1;
    padding: 24px 32px;
}

.section {
    margin-bottom: 32px;
}

.section:last-of-type {
    margin-bottom: 0;
}

.section-label {
    font-family: var(--font-d);
    font-size: 8px;
    color: var(--w4);
    letter-spacing: 0.25em;
    margin-bottom: 16px;
    text-transform: uppercase;
}

.client-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.info-item {
    background: var(--s2);
    padding: 16px;
    border: 1px solid var(--b2);
}

.info-label {
    font-family: var(--font-d);
    font-size: 8px;
    color: var(--w4);
    letter-spacing: 0.15em;
    margin-bottom: 8px;
}

.info-value {
    font-family: var(--font-b);
    font-size: 12px;
    color: var(--w);
    word-break: break-word;
}

.items-container {
    background: var(--s2);
    border: 1px solid var(--b2);
}

.item-row {
    display: grid;
    grid-template-columns: 1fr 80px 100px 120px;
    gap: 12px;
    padding: 14px 16px;
    align-items: center;
    border-bottom: 1px solid var(--b2);
}

.item-row:last-child {
    border-bottom: none;
}

.item-name {
    font-size: 11px;
    color: var(--w);
    font-weight: 500;
}

.item-qty {
    text-align: center;
    font-size: 10px;
    color: var(--w3);
    font-family: var(--font-d);
}

.item-price {
    text-align: right;
    font-size: 10px;
    color: var(--w3);
}

.item-total {
    text-align: right;
    font-size: 11px;
    color: var(--w);
    font-weight: 600;
}

.summary-row {
    background: var(--s2);
    padding: 20px 16px;
    border: 1px solid var(--b2);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.summary-label {
    font-family: var(--font-d);
    font-size: 8px;
    color: var(--w4);
    letter-spacing: 0.15em;
}

.summary-value {
    font-family: var(--font-d);
    font-size: 18px;
    color: var(--acc);
    font-weight: 700;
}

.status-display {
    background: var(--s2);
    padding: 16px;
    border: 1px solid var(--b2);
    font-family: var(--font-d);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--acc);
    margin-bottom: 12px;
    text-align: center;
}

.status-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}

.status-btn {
    padding: 12px 16px;
    font-size: 9px;
    font-family: var(--font-d);
    letter-spacing: 0.12em;
    border: 1px solid var(--b2);
    background: var(--s2);
    color: var(--w3);
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
}

.status-btn:hover:not(:disabled) {
    border-color: var(--acc);
    color: var(--acc);
    background: var(--void);
}

.status-btn.active {
    background: var(--acc);
    color: var(--void);
    border-color: var(--acc);
}

.status-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.status-btn.pending { --accent-color: #ffa500; }
.status-btn.confirmed { --accent-color: #4ecdc4; }
.status-btn.delivered { --accent-color: #95e1d3; }
.status-btn.rejected { --accent-color: #ff6b6b; }

.modal-footer {
    padding: 20px 32px;
    border-top: 1px solid var(--b2);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-close {
    background: transparent;
    border: 1px solid var(--b2);
    color: var(--w3);
    font-family: var(--font-d);
    font-size: 11px;
    letter-spacing: 0.12em;
    padding: 12px 24px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.15s;
}

.btn-close:hover {
    border-color: var(--w);
    color: var(--w);
    background: var(--s2);
}

/* Scrollbar styling */
.modal-body::-webkit-scrollbar {
    width: 6px;
}

.modal-body::-webkit-scrollbar-track {
    background: var(--s2);
}

.modal-body::-webkit-scrollbar-thumb {
    background: var(--b2);
    border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: var(--w3);
}
</style>
