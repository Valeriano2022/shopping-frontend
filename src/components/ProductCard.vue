<script setup lang="ts">
import type { AddToCartRequest } from '@/types/cart'
import type { ProductResponse } from '@/types/product'

defineProps<{ product: ProductResponse }>()
const emit = defineEmits<{
  (event: 'add-to-cart', payload: AddToCartRequest): void
}>()
</script>

<template>
  <div
    class="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition p-4 cursor-pointer"
  >
    {{ console.log(product.photoUrl) }}
    <img :src="product.photoUrl" class="w-full h-48 object-cover rounded-lg mb-3" alt="product" />

    <p class="text-slate-500 text-xs">{{ product.description }}</p>

    <h3 class="font-semibold text-slate-900 text-base mt-1 leading-tight">
      {{ product.name }}
    </h3>

    <p class="text-blue-600 font-bold text-lg mt-2">${{ product.price.toFixed(2) }}</p>

    <button
      @click="emit('add-to-cart', { productId: product.id, quantity: 1 })"
      class="w-full mt-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition font-medium"
    >
      Add to Cart
    </button>
  </div>
</template>
