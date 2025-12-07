export interface ProductRequest {
  name: string
  description?: string
  price: number
  stock: number
  photoUrl?: string
}
export interface ProductResponse {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  photoUrl?: string
  createdAt: string
  updatedAt: string
}
