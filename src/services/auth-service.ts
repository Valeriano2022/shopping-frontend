import { saveAccessToken } from '@/api/token'
import { api } from './api-client'
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '@/types/auth'

export async function logIn(payload: LoginRequest) {
  const res = await api.post<LoginResponse>('/api/auth/login', payload)
  return res.data
}

export async function signUp(payload: RegisterRequest) {
  const res = await api.post<RegisterResponse>('/api/auth/register', payload)
  return res.data
}

export async function logOut() {
  return api.post('/api/auth/logout')
}
