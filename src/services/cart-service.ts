import { api } from './api-client'
import type { EntityModel } from '@/types/hateoas'
import { unwrapEntity } from '@/types/hateoas'
import type {
  CartResponse,
  CartItemResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '@/types/cart'

export async function fetchCart() {
  const res = await api.get<EntityModel<CartResponse>>('/api/cart')
  return unwrapEntity(res.data)
}

export async function addToCart(payload: AddToCartRequest) {
  const res = await api.post<EntityModel<CartResponse>>('/api/cart/items', payload)
  return unwrapEntity(res.data)
}

export async function updateCartItem(payload: UpdateCartItemRequest) {
  const res = await api.put<EntityModel<CartItemResponse>>(
    `/api/cart/items/${payload.cartItemId}`,
    payload,
  )
  return unwrapEntity(res.data)
}

export async function removeCartItem(cartItemId: number) {
  return api.delete(`/api/cart/items/${cartItemId}`)
}

export async function removeByProduct(productId: number) {
  return api.delete(`/api/cart/products/${productId}`)
}

export async function clearCart() {
  return api.delete('/api/cart')
}
