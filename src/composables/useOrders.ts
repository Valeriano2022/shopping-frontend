import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/useOrderStore'

export function useOrders() {
  const store = useOrderStore()

  const { orders, order, page, loading } = storeToRefs(store)
  const { loadOrders, loadOrder, create, cancel } = store

  const cancelOrder = (orderId: number, reason: string) => {
    return cancel(orderId, reason)
  }

  return {
    orders,
    order,
    page,
    loading,
    loadOrders,
    loadOrder,
    create,
    cancel: cancelOrder,
  }
}
