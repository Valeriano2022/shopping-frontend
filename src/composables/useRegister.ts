import { ref } from 'vue'
import { signUp } from '@/services/useAuthService'
import type { RegisterRequest } from '@/types/auth'
import { useToastHandler } from '@/composables/useToastHandler'

export function useRegister() {
  const loading = ref(false)
  const success = ref(false)
  const { apiError, success: successToast } = useToastHandler()

  const register = async (payload: RegisterRequest) => {
    loading.value = true
    success.value = false

    try {
      await signUp(payload)

      success.value = true
      successToast('Registration successful! You may now log in.')

      return true
    } catch (err: unknown) {
      apiError(err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    register,
    loading,
    success,
  }
}
