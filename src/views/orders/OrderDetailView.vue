<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrders } from '@/composables/useOrders'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { formatDate } from '@/utils/date'
import CancelOrderModal from '@/components/CancelOrderModal.vue'

const { order, loadOrder, cancel } = useOrders()
const toast = useToast()
const route = useRoute()

const id = Number(route.params.id)

const showCancelModal = ref(false)
const submittingCancel = ref(false)
const backToOrders = ref(false)

onMounted(() => loadOrder(id))

const openCancelModal = () => (showCancelModal.value = true)
const closeCancelModal = () => (showCancelModal.value = false)
const back = () => {
  backToOrders.value = true
  window.history.back()
}

const submitCancellation = async (reason: string) => {
  if (!reason.trim()) {
    toast.error('Please provide a cancellation reason.')
    return
  }

  submittingCancel.value = true

  try {
    await cancel(id, reason)
    await loadOrder(id)
    closeCancelModal()
    toast.success('Order cancelled successfully.')
  } catch {
    toast.error('Failed to cancel order.')
  } finally {
    submittingCancel.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen p-4">
    <div v-if="!order" class="text-slate-500">Loading...</div>

    <div v-else class="space-y-6">
      <h1 class="text-2xl font-semibold">Order #{{ order.id }}</h1>

      <div class="p-4 bg-white rounded-lg shadow border border-slate-200">
        <p>
          Status: <span class="font-medium">{{ order.status }}</span>
        </p>
        <p class="mt-2">Total: ${{ order.totalAmount.toFixed(2) }}</p>
        <p class="text-xs text-slate-400 mt-1">Placed: {{ formatDate(order.createdAt) }}</p>

        <p v-if="order.cancelReason" class="mt-4 text-red-600 font-semibold">
          Cancel Reason: “{{ order.cancelReason }}”
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">Items</h2>
        <div
          v-for="item in order.items"
          :key="item.id"
          class="p-4 bg-white shadow rounded-lg border border-slate-200 transition mb-4 flex items-center gap-4"
        >
          <img :src="item.product.photoUrl" class="h-20 w-20 rounded object-cover" />
          <div class="flex-1">
            <p class="font-medium">{{ item.product.name }}</p>
            <p class="text-sm text-slate-600">Qty: {{ item.quantity }}</p>
            <p class="text-sm text-slate-600">Price: ${{ item.priceAtPurchase }}</p>
            <p class="font-semibold mt-1">Subtotal: ${{ item.subtotal }}</p>
          </div>
        </div>
      </div>

      <div>
        <button
          v-if="order.status === 'NEW'"
          @click="openCancelModal"
          class="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition mr-4"
        >
          Cancel Order
        </button>
        <button
          @click="back"
          class="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to Orders
        </button>
      </div>
    </div>

    <CancelOrderModal
      :show="showCancelModal"
      :loading="submittingCancel"
      @close="closeCancelModal"
      @submit="submitCancellation"
    />
  </div>
</template>
