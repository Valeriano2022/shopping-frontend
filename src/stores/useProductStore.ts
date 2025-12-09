import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchProducts } from '@/services/product-service'
import type { ProductResponse } from '@/types/product'
import type { UnwrappedPaged } from '@/types/hateoas'
import { useToastHandler } from '@/composables/useToastHandler'

export const useProductStore = defineStore('products', () => {
  const products = ref<ProductResponse[]>([])
  const page = ref<UnwrappedPaged<ProductResponse> | null>(null)
  const loading = ref(false)
  const { apiError } = useToastHandler()

  const loadProducts = async (pageIndex = 0, size = 12) => {
    loading.value = true
    try {
      const data = await fetchProducts(pageIndex, size)

      page.value = data

      products.value = data.items
    } catch (error) {
      apiError(error)
    } finally {
      loading.value = false
    }
  }

  return { products, page, loading, loadProducts }
})
