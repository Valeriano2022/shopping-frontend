import { api } from '@/services/api-client'
import { unwrapEntity, unwrapPaged } from '@/types/hateoas'
import type { EntityModel, PagedModel } from '@/types/hateoas'
import type { CheckOutRequest, OrderResponse } from '@/types/order'

// Create new order
export async function createOrder(payload: CheckOutRequest) {
  const res = await api.post<EntityModel<OrderResponse>>('/api/orders', payload)
  return unwrapEntity(res.data)
}

// Get a single order
export async function getOrder(orderId: number) {
  const res = await api.get<EntityModel<OrderResponse>>(`/api/orders/${orderId}`)
  return unwrapEntity(res.data)
}

// Get paginated orders
export async function getOrders(page = 0, size = 12) {
  const res = await api.get<PagedModel<OrderResponse>>('/api/orders', {
    params: { page, size },
  })
  return unwrapPaged(res.data)
}

// Cancel order
export async function cancelOrder(orderId: number, reason: string) {
  const res = await api.patch<EntityModel<OrderResponse>>(`/api/orders/${orderId}/cancel`, {
    params: { reason },
  })
  return unwrapEntity(res.data)
}
