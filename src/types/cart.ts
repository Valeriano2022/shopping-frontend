import type { ProductResponse } from './product'

export interface AddToCartRequest {
  productId: number
  quantity: number
}
export interface UpdateCartItemRequest {
  cartItemId: number
  quantity: number
}
export interface CartItemResponse {
  id: number
  product: ProductResponse
  quantity: number
  subtotal: number
  createdAt: string
  updatedAt: string
}
export interface CartResponse {
  id: number
  userId: number
  items: CartItemResponse[]
  totalAmount: number
  createdAt: string
  updatedAt: string
}
