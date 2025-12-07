import type { ProductResponse } from "./product"

export interface CheckOutRequest {
  paymentmethod?: string
}
export interface OrderItemResponse {
  id: number
  product: ProductResponse
  quantity: number
  priceAtPurchase: number
  subtotal: number
  createdAt: string
  updatedAt: string
}
export interface OrderResponse {
  id: number
  userId: number
  totalAmount: number
  status: string
  cancelReason?: string | null
  items: OrderItemResponse[]
  createdAt: string
  updatedAt: string
}
