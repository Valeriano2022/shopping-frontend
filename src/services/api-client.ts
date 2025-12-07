import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

import { getAccessToken, saveAccessToken } from '@/api/token'
import { useAuthStore } from '@/stores/useAuthStore'
import type { RetryAxiosRequestConfig, QueueItem } from '@/types/api'
import type { RefreshTokenResponse } from '@/types/auth'


// API INSTANCE
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Separate refresh client to avoid interceptor recursion
const refreshClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})


// REFRESH STATE
let isRefreshing = false
let queue: QueueItem[] = []

const resolveQueue = (error: unknown, token: string | null): void => {
  queue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token)
  })
  queue = []
}


// REFRESH LOGIC (hits /auth/refresh)
const refreshAccessToken = async (): Promise<string> => {
  const res = await refreshClient.post('/auth/refresh', {})
  const newToken = (res.data as RefreshTokenResponse).accessToken
  saveAccessToken(newToken)
  return newToken
}


// REQUEST INTERCEPTOR — attach Access Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)


// RESPONSE INTERCEPTOR — refresh on 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const auth = useAuthStore()
    const original = error.config as RetryAxiosRequestConfig

    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    if (original._retry) {
      auth.logout()
      return Promise.reject(error)
    }

    // Queue all failed requests during refresh
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then((token) => {
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    // Start refresh process
    original._retry = true
    isRefreshing = true

    try {
      const newToken = await refreshAccessToken()

      resolveQueue(null, newToken)

      original.headers = original.headers ?? {}
      original.headers.Authorization = `Bearer ${newToken}`

      return api(original)

    } catch (refreshError) {
      resolveQueue(refreshError, null)
      auth.logout()
      return Promise.reject(refreshError)

    } finally {
      isRefreshing = false
    }
  },
)
