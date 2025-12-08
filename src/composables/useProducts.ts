import { ref, watch } from 'vue'
import { fetchProducts } from '@/services/product-service'
import { useSearchStore } from '@/stores/useSearchStore'
import type { UnwrappedPaged } from '@/types/hateoas'
import type { ProductResponse } from '@/types/product'
import { useToastHandler } from './useToastHandler'

export function useProducts() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<UnwrappedPaged<ProductResponse> | null>(null)

  const searchStore = useSearchStore()
  const { apiError } = useToastHandler()

  const load = async (pageIndex = 0) => {
    loading.value = true
    error.value = null

    try {
      data.value = await fetchProducts(pageIndex, 12, searchStore.query)
    } catch (err) {
      apiError(err)
      error.value = 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  watch(
    () => searchStore.query,
    () => load(0),
  )

  return {
    data,
    loading,
    error,
    load,
  }
}
