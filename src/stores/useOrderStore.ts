import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createOrder, getOrder, getOrders, cancelOrder } from '@/services/order-service'
import type { OrderResponse, CheckOutRequest } from '@/types/order'
import { useToastHandler } from '@/composables/useToastHandler'
import type { UnwrappedPaged } from '@/types/hateoas'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<OrderResponse[]>([])
  const order = ref<OrderResponse | null>(null)
  const page = ref<UnwrappedPaged<OrderResponse> | null>(null)
  const loading = ref(false)

  const { apiError, success } = useToastHandler()

  const loadOrders = async (pageNum = 0, size = 12) => {
    loading.value = true
    try {
      const result = await getOrders(pageNum, size)
      orders.value = result.items
      page.value = result
    } catch (err) {
      apiError(err)
    } finally {
      loading.value = false
    }
  }

  const loadOrder = async (orderId: number) => {
    loading.value = true
    try {
      order.value = await getOrder(orderId)
    } catch (err) {
      apiError(err)
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: CheckOutRequest) => {
    try {
      const created = await createOrder(payload)
      success('Order created successfully!')
      return created
    } catch (err) {
      apiError(err)
    }
  }

  const cancel = async (id: number, reason: string) => {
    try {
      const updated = await cancelOrder(id, reason)
      success('Order cancelled!')
      return updated
    } catch (err) {
      apiError(err)
    }
  }

  return {
    orders,
    order,
    page,
    loading,
    loadOrders,
    loadOrder,
    create,
    cancel,
  }
})
