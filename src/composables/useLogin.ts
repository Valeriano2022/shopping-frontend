import { ref } from 'vue'
import { logIn } from '@/services/auth-service'
import type { LoginRequest } from '@/types/auth'
import { useToastHandler } from '@/composables/useToastHandler'
import { useAuthStore } from '@/stores/useAuthStore'

export function useLogin() {
  const loading = ref(false)
  const { apiError, success: successToast } = useToastHandler()
  const auth = useAuthStore()

  const login = async (payload: LoginRequest) => {
    loading.value = true

    try {
      const res = await logIn(payload)

      auth.login(res)

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
