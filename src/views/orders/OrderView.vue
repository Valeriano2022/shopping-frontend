<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrders } from '@/composables/useOrders'
import { useRouter } from 'vue-router'

const { page, loadOrders, loading } = useOrders()
const router = useRouter()

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
      <div
        v-for="o in page.items"
        :key="o.id"
        @click="goToOrder(o.id)"
        class="p-4 bg-white shadow rounded-lg border border-slate-200 hover:shadow-md transition cursor-pointer"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-slate-900">Order #{{ o.id }}</h3>
          <span class="text-sm text-slate-500">{{ o.status }}</span>
        </div>

        <p class="text-slate-600 mt-1">
          {{ o.items.length }} item(s) — Total:
          <span class="font-semibold">${{ o.totalAmount.toFixed(2) }}</span>
        </p>

        <p class="text-xs text-slate-400">Placed: {{ o.createdAt }}</p>
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
