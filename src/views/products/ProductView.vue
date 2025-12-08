<script setup lang="ts">
import { onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'
import { useToast } from 'vue-toastification'
import ProductCard from '@/components/ProductCard.vue'
import type { AddToCartRequest } from '@/types/cart'
const { data, load, loading, error } = useProducts()
const { add } = useCart()
const toast = useToast()

onMounted(() => load())

const onAddToCart = async (payload: AddToCartRequest) => {
  try {
    await add(payload)
  } catch {
    toast.error('Failed to add to cart.')
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Products</h1>

    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="h-64 rounded-xl bg-slate-200 animate-pulse"></div>
    </div>

    <div v-else-if="error" class="text-red-600">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard v-for="p in data?.items" :key="p.id" :product="p" @add-to-cart="onAddToCart" />
    </div>

    <div v-if="data" class="flex justify-center mt-8 gap-4">
      <button
        @click="load(data.page.number - 1)"
        :disabled="data.page.number <= 0"
        class="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <button
        @click="load(data.page.number + 1)"
        :disabled="data.page.number >= data.page.totalPages - 1"
        class="px-4 py-2 bg-slate-900 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>
