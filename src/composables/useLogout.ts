import { useAuthStore } from '@/stores/useAuthStore'
import { api } from '@/services/api-client'
import { useToastHandler } from '@/composables/useToastHandler'
import { ref } from 'vue'

export function useLogout() {
  const loading = ref(false)
  const auth = useAuthStore()
  const { success, apiError } = useToastHandler()

  const logout = async () => {
    loading.value = true

    try {
      await api.post('/api/auth/logout')
      success('You have been logged out.')
    } catch (err) {
      // do NOT block logout on backend errors
      apiError(err)
    } finally {
      auth.logout()
      loading.value = false
    }
  }

  return { logout, loading }
}
