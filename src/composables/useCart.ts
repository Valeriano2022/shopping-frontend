import { computed, ref } from 'vue'
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  removeByProduct,
  clearCart,
} from '@/services/cart-service'
import type { CartResponse, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart'
import { useToastHandler } from './useToastHandler'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSearchStore } from '@/stores/useSearchStore'
import { useOrders } from './useOrders'

export function useCart() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const cart = ref<CartResponse | null>(null)

  const { apiError, success } = useToastHandler()
  const auth = useAuthStore()
  const router = useRouter()
  const { create } = useOrders()
  const toast = useToastHandler()

  const load = async () => {
    loading.value = true
    try {
      cart.value = await fetchCart()
    } catch (err) {
      apiError(err)
      error.value = 'Unable to load cart'
    } finally {
      loading.value = false
    }
  }

  const add = async (payload: AddToCartRequest) => {
    if (!auth.isAuthenticated) {
      toast.warning('Please login to add items to your cart.')
      router.push('/login')
      return
    }
    try {
      cart.value = await addToCart(payload)
      await load()
      success('Added to cart!')
      window.dispatchEvent(new Event('cart-updated'))
    } catch (err) {
      apiError(err)
    }
  }

  const update = async (payload: UpdateCartItemRequest) => {
    try {
      const updated = await updateCartItem(payload)
      await load()
      if (cart.value) {
        const idx = cart.value.items.findIndex((i) => i.id === updated.id)
        if (idx !== -1) {
          cart.value.items[idx] = updated
        }
      }
    } catch (err) {
      apiError(err)
    }
  }

  const remove = async (cartItemId: number) => {
    try {
      await removeCartItem(cartItemId)
      await load()
      if (cart.value) {
        cart.value.items = cart.value.items.filter((i) => i.id !== cartItemId)
      }

      success('Removed item')
      window.dispatchEvent(new Event('cart-updated'))
    } catch (err) {
      apiError(err)
    }
  }

  const removeProduct = async (productId: number) => {
    try {
      await removeByProduct(productId)
      await load()
      if (cart.value) {
        cart.value.items = cart.value.items.filter((i) => i.product.id !== productId)
      }

      success('Product removed')
      window.dispatchEvent(new Event('cart-updated'))
    } catch (err) {
      apiError(err)
    }
  }

  const clear = async () => {
    try {
      await clearCart()
      await load()
      window.dispatchEvent(new Event('cart-updated'))
      if (cart.value) cart.value.items = []
    } catch (err) {
      apiError(err)
    }
  }

  const checkout = async () => {
    try {
      if (!cart.value || cart.value.items.length === 0) {
        apiError('Your cart is empty.')
        return
      }
      const order = await create({})
      if (!order) {
        apiError('Failed to create order.')
        return
      }
      await clear()
      router.push(`/orders`)
    } catch (error) {
      apiError(`Checkout failed. ${(error as Error).message}`)
    }
  }
  const searchStore = useSearchStore()

  const filteredItems = computed(() => {
    if (!cart.value) return []
    if (!searchStore.query) return cart.value.items

    return cart.value.items.filter((i) =>
      i.product.name.toLowerCase().includes(searchStore.query.toLowerCase()),
    )
  })

  return {
    cart,
    loading,
    error,
    load,
    add,
    update,
    remove,
    removeProduct,
    clear,
    checkout,
    filteredItems,
  }
}
