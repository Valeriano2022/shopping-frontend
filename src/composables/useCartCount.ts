import { ref, onMounted, onBeforeUnmount } from 'vue'
import { api } from '@/services/api-client'

export function useCartCount() {
  const count = ref(0)
  const loading = ref(false)

  const fetchCount = async () => {
    loading.value = true
    try {
      const res = await api.get('/api/cart')
      count.value = res.data?.items?.length ?? 0
    } catch (err) {
      count.value = 0
    } finally {
      loading.value = false
    }
  }

  const listener = () => fetchCount()

  onMounted(() => {
    fetchCount()
    window.addEventListener('cart-updated', listener)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('cart-updated', listener)
  })

  return { count, loading, refresh: fetchCount }
}
