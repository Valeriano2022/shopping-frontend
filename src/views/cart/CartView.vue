<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-3xl font-semibold mb-8">Your Cart</h1>

    <div v-if="loading" class="space-y-6">
      <div v-for="i in 3" :key="i" class="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>

    <div v-else-if="cart && cart.items.length === 0" class="text-center py-16">
      <h2 class="text-2xl font-semibold text-slate-700 mb-4">Your cart is empty</h2>
      <RouterLink
        to="/products"
        class="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-black transition"
      >
        Browse Products
      </RouterLink>
    </div>

    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div class="lg:col-span-2 space-y-6">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="flex items-center gap-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
        >
          <img :src="item.product.photoUrl" class="w-24 h-24 rounded-lg object-cover" />

          <div class="flex-1">
            <h3 class="text-lg font-semibold text-slate-800">{{ item.product.name }}</h3>
            <p class="text-slate-500 text-sm mt-1">${{ item.product.price.toFixed(2) }}</p>

            <div class="flex items-center gap-3 mt-3">
              <button
                class="w-8 h-8 flex items-center justify-center rounded-md bg-slate-200 hover:bg-slate-300 transition"
                @click="decrease(item)"
              >
                -
              </button>

              <span class="text-lg font-semibold">{{ item.quantity }}</span>

              <button
                class="w-8 h-8 flex items-center justify-center rounded-md bg-slate-200 hover:bg-slate-300 transition"
                @click="increase(item)"
              >
                +
              </button>
            </div>
          </div>

          <div class="text-right">
            <p class="text-lg font-bold text-slate-900">${{ item.subtotal.toFixed(2) }}</p>

            <button
              @click="removeItem(item.id)"
              class="mt-3 text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit">
        <h2 class="text-xl font-semibold mb-4">Summary</h2>

        <div class="flex justify-between text-slate-700 mb-3">
          <span>Total Items:</span>
          <span>{{ cart?.items.length }}</span>
        </div>

        <div class="flex justify-between text-slate-700 mb-3">
          <span>Total Amount:</span>
          <span class="font-bold text-slate-900">${{ cart?.totalAmount.toFixed(2) }}</span>
        </div>

        <button
          @click="onCheckout"
          class="mt-6 w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-black transition font-medium"
        >
          Checkout
        </button>

        <button
          @click="clearCart"
          class="mt-3 w-full py-2 text-red-600 hover:text-red-700 transition"
        >
          Clear Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCart } from '@/composables/useCart'
import type { CartItemResponse } from '@/types/cart'
import { useToast } from 'vue-toastification'

const { cart, loading, error, load, update, remove, clear, checkout, filteredItems } = useCart()
const toast = useToast()

onMounted(() => load())

const increase = (item: CartItemResponse) => {
  update({ cartItemId: item.id, quantity: item.quantity + 1 })
}

const decrease = (item: CartItemResponse) => {
  if (item.quantity === 1) return
  update({ cartItemId: item.id, quantity: item.quantity - 1 })
}

const removeItem = (id: number) => {
  try {
    remove(id)
  } catch (error) {
    toast.error(`Failed to remove item. ${(error as Error).message}`)
  }
}

const clearCart = () => {
  try {
    clear()
    toast.success('Cart cleared.')
  } catch (error) {
    toast.error(`Failed to clear cart. ${(error as Error).message}`)
  }
}

const onCheckout = async () => {
  checkout()
}
</script>
