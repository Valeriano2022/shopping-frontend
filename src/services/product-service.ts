import { api } from './api-client'
import type { PagedModel, EntityModel } from '@/types/hateoas'
import type { ProductResponse } from '@/types/product'
import { unwrapEntity, unwrapPaged } from '@/types/hateoas'

export async function fetchProducts(page = 0, size = 20) {
  const res = await api.get<PagedModel<ProductResponse>>('/api/products', {
    params: { page, size },
  })

  return unwrapPaged(res.data)
}

export async function fetchProduct(productId: number) {
  const res = await api.get<EntityModel<ProductResponse>>(`/api/products/${productId}`)

  return unwrapEntity(res.data)
}
