export interface UserResponse {
  id: number
  name: string
  email: string
}
export interface LoginRequest {
  email: string
  password: string
}
export interface RegisterRequest {
  name: string
  email: string
  password: string
}
export interface LoginResponse {
  accessToken: string
  user: UserResponse
}
export interface RegisterResponse{
  user:UserResponse
}
export interface RefreshTokenResponse {
  accessToken: string
}

