<script setup lang="ts">
import { onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'
import type { AddToCartRequest } from '@/types/cart'

const { filteredProducts, pageInfo, load } = useProducts()
const { add } = useCart()

onMounted(() => load(0))

const onAddToCart = (payload: AddToCartRequest) => {
  add(payload)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Products</h1>

    <div v-if="pageInfo === null" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="h-64 rounded-xl bg-slate-200 animate-pulse"></div>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center text-slate-500 py-10">
      No products found.
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="p in filteredProducts"
        :key="p.id"
        :product="p"
        @add-to-cart="onAddToCart"
      />
    </div>

    <div v-if="pageInfo" class="flex justify-center mt-8 gap-4">
      <button
        @click="load(pageInfo.page.number - 1)"
        :disabled="pageInfo.page.number <= 0"
        class="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <button
        @click="load(pageInfo.page.number + 1)"
        :disabled="pageInfo.page.number >= pageInfo.page.totalPages - 1"
        class="px-4 py-2 bg-slate-900 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>
