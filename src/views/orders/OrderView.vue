<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrders } from '@/composables/useOrders'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/date'

const { page, loadOrders, loading, filteredOrders, setStatus, selectedStatus } = useOrders()
const statuses = ['ALL', 'NEW', 'CANCELLED', 'PENDING', 'COMPLETED'] as const
const router = useRouter()

const underlineColors = {
  ALL: 'border-slate-900 text-slate-900',
  NEW: 'border-blue-600 text-blue-600',
  CANCELLED: 'border-red-600 text-red-600',
  PENDING: 'border-yellow-500 text-yellow-600',
  COMPLETED: 'border-green-600 text-green-600',
}

onMounted(() => {
  loadOrders(0, 10)
})

const goToOrder = (id: number) => {
  router.push(`/orders/${id}`)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">My Orders</h1>

    <div v-if="loading" class="text-slate-500">Loading...</div>

    <div v-else-if="!page || page.items.length === 0" class="text-slate-500">
      You have no orders yet.
    </div>

    <div v-else class="space-y-4">
      <div class="flex gap-4 mb-6">
        <button
          v-for="stat in statuses"
          :key="stat"
          @click="setStatus(stat)"
          class="px-4 py-2 border-b-2"
          :class="
            selectedStatus === stat ? underlineColors[stat] : 'border-transparent text-slate-500'
          "
        >
          {{ stat }}
        </button>
      </div>
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        @click="goToOrder(order.id)"
        class="p-4 bg-white shadow rounded-lg border border-slate-200 hover:shadow-md transition cursor-pointer"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-slate-900">Order #{{ order.id }}</h3>
          <span class="text-sm text-slate-500">{{ order.status }}</span>
        </div>

        <p class="text-slate-600 mt-1">
          {{ order.items.length }} item(s) — Total:
          <span class="font-semibold">${{ order.totalAmount.toFixed(2) }}</span>
        </p>

        <p class="text-xs text-slate-400">Placed: {{ formatDate(order.createdAt) }}</p>
      </div>
    </div>

    <div v-if="page" class="flex justify-center mt-6 gap-4">
      <button
        @click="loadOrders(page.page.number - 1)"
        :disabled="page.page.number <= 0"
        class="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <button
        @click="loadOrders(page.page.number + 1)"
        :disabled="page.page.number >= page.page.totalPages - 1"
        class="px-4 py-2 bg-slate-900 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>
