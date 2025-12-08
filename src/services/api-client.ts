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

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Separate client to avoid recursion when refreshing
const refreshClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

let isRefreshing = false
let queue: QueueItem[] = []

const resolveQueue = (error: unknown, token: string | null): void => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)))
  queue = []
}

const refreshAccessToken = async (): Promise<string> => {
  const res = await refreshClient.post<RefreshTokenResponse>('/auth/refresh', {})
  const newToken = res.data.accessToken

  saveAccessToken(newToken)

  return newToken
}

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

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const auth = useAuthStore()
    const original = error.config as RetryAxiosRequestConfig

    // Only refresh on 401 or 403
    const status = error.response?.status
    if (![401, 403].includes(status ?? 0)) {
      return Promise.reject(error)
    }

    // Already retried? → logout
    if (original._retry) {
      auth.logout()
      return Promise.reject(error)
    }

    // If refresh already running → queue request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then((token) => {
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    // Start refresh
    original._retry = true
    isRefreshing = true

    try {
      const newToken = await refreshAccessToken()

      resolveQueue(null, newToken)

      // retry original request
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
