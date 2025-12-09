import { computed, watch } from 'vue'
import { useSearchStore } from '@/stores/useSearchStore'
import { useProductStore } from '@/stores/useProductStore'

export function useProducts() {
  const productStore = useProductStore()
  const searchStore = useSearchStore()

  const load = productStore.loadProducts

  const pageInfo = computed(() => productStore.page)

  const filteredProducts = computed(() => {
    if (!searchStore.query) return productStore.products

    const q = searchStore.query.toLowerCase()
    return productStore.products.filter((p) => p.name.toLowerCase().includes(q))
  })

  watch(
    () => searchStore.query,
    () => load(0),
  )

  return {
    load,
    filteredProducts,
    pageInfo,
  }
}
