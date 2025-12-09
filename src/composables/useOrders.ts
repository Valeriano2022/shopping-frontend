import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/useOrderStore'
import { computed } from 'vue'
import { useSearchStore } from '@/stores/useSearchStore'

export function useOrders() {
  const store = useOrderStore()

  const { orders, order, page, loading, selectedStatus, filteredOrders } = storeToRefs(store)
  const { loadOrders, loadOrder, create, cancel, setStatus } = store

  const cancelOrder = (orderId: number, reason: string) => {
    return cancel(orderId, reason)
  }

  const searchStore = useSearchStore()

  const filteredAndSearchedOrders = computed(() => {
    const list = filteredOrders.value
    const q = searchStore.query.toLowerCase().trim()

    if (!q) return list

    return list.filter((o) => o.id.toString().includes(q) || o.status.toLowerCase().includes(q))
  })

  return {
    orders,
    order,
    page,
    loading,
    loadOrders,
    loadOrder,
    create,
    cancel: cancelOrder,
    setStatus,
    selectedStatus,
    filteredOrders: filteredAndSearchedOrders,
  }
}
