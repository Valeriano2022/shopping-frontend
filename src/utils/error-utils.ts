import type { AxiosError } from 'axios'
import type { ErrorResponse } from '@/types/error'

export function parseAxiosError(err: unknown): ErrorResponse | null {
  const axiosErr = err as AxiosError<ErrorResponse>

  if (axiosErr.response?.data) {
    return axiosErr.response.data
  }

  return null
}
