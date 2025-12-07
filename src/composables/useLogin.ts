import { ref } from 'vue'
import { logIn } from '@/services/useAuthService'
import type { LoginRequest } from '@/types/auth'
import { useToastHandler } from '@/composables/useToastHandler'

export function useLogin() {
  const loading = ref(false)
  const { apiError, success: successToast } = useToastHandler()

  const login = async (payload: LoginRequest) => {
    loading.value = true

    try {
      await logIn(payload)
      successToast('Welcome back!')
      return true
    } catch (err: unknown) {
      apiError(err)
      return false
    } finally {
      loading.value = false
    }
  }

  return { login, loading }
}
