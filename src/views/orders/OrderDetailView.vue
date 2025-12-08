<template>
  <div class="relative min-h-screen">
    <div v-if="!order" class="text-slate-500 p-6">Loading...</div>

    <div v-else class="space-y-6 p-4">
      <h1 class="text-2xl font-semibold">Order #{{ order.id }}</h1>

      <div class="p-4 bg-white rounded-lg shadow border border-slate-200">
        <p class="text-slate-700">
          Status: <span class="font-medium">{{ order.status }}</span>
        </p>

        <p class="text-slate-700 mt-2">
          Total Amount:
          <span class="font-medium">${{ order.totalAmount.toFixed(2) }}</span>
        </p>

        <p class="text-xs text-slate-400 mt-1">Placed: {{ order.createdAt }}</p>

        <p v-if="order.cancelReason" class="mt-4 text-red-700 font-medium">
          Cancel Reason: "{{ order.cancelReason }}"
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">Items</h2>

        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex gap-4 p-4 bg-white shadow rounded-lg border border-slate-200"
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

      <div v-if="order.status === 'NEW'">
        <button
          @click="openCancelModal"
          class="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Cancel Order
        </button>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="showCancelModal"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      >
        <transition name="modal">
          <div
            v-show="showCancelModal"
            class="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div class="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 class="text-xl font-semibold text-slate-900">Cancel Order</h3>

              <button @click="closeCancelModal" class="text-slate-500 hover:text-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="px-6 py-5">
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Reason for cancellation:
              </label>

              <textarea
                v-model="cancelReason"
                rows="4"
                class="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Please explain why you are cancelling this order..."
              ></textarea>
            </div>

            <div class="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-200">
              <button
                @click="closeCancelModal"
                class="px-4 py-2 rounded-md text-slate-600 hover:text-slate-800 transition"
              >
                Cancel
              </button>

              <button
                @click="submitCancellation"
                :disabled="submittingCancel"
                class="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {{ submittingCancel ? 'Cancelling…' : 'Confirm' }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrders } from '@/composables/useOrders'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const { order, loadOrder, cancel } = useOrders()
const toast = useToast()
const route = useRoute()

const id = Number(route.params.id)

const showCancelModal = ref(false)
const cancelReason = ref('')
const submittingCancel = ref(false)

onMounted(() => loadOrder(id))

const openCancelModal = () => {
  showCancelModal.value = true
}

const closeCancelModal = () => {
  cancelReason.value = ''
  showCancelModal.value = false
}

const submitCancellation = async () => {
  if (!cancelReason.value.trim()) {
    toast.error('Please provide a cancellation reason.')
    return
  }

  submittingCancel.value = true

  try {
    await cancel(id, cancelReason.value)
    await loadOrder(id)

    toast.success('Order cancelled successfully.')
    closeCancelModal()
  } catch {
    toast.error('Failed to cancel order.')
  } finally {
    submittingCancel.value = false
  }
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}
</style>
