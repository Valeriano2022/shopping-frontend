import  {useToast, TYPE } from 'vue-toastification'
import { parseAxiosError } from '@/utils/error-utils'

export function useToastHandler() {
  const toast = useToast()

  const success = (message: string) => {
    toast(message, { type: TYPE.SUCCESS })
  }

  const error = (message: string) => {
    toast(message, { type: TYPE.ERROR })
  }

  const warning = (message: string) => {
    toast(message, { type: TYPE.WARNING })
  }

  const info = (message: string) => {
    toast(message, { type: TYPE.INFO })
  }

  const apiError = (err: unknown) => {
    const backendError = parseAxiosError(err)

    if (!backendError) {
      toast('Unexpected error occurred', { type: TYPE.ERROR })
      return
    }

    switch (backendError.status) {
      case 400:
        toast(backendError.message || 'Invalid request.', { type: TYPE.ERROR })
        break
      case 401:
        toast('Please log in to continue.', { type: TYPE.ERROR })
        break
      case 403:
        toast('You do not have permission to do this action.', { type: TYPE.ERROR })
        break
      case 404:
        toast('The requested resource was not found.', { type: TYPE.ERROR })
        break
      case 500:
        toast('Server error. Please try again later.', { type: TYPE.ERROR })
        break
      default:
        toast(backendError.message || 'Unexpected error occurred', { type: TYPE.ERROR })
        break
    }
  }

  return {
    success,
    error,
    warning,
    info,
    apiError,
  }
}
