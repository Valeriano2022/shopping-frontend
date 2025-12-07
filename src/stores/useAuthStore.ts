import { defineStore } from 'pinia'
import { removeAccessToken, getAccessToken, saveAccessToken } from '@/api/token'
import type { UserResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserResponse | null,
    accessToken: getAccessToken(),
  }),

  actions: {
    login(data: { user: UserResponse; accessToken: string }) {
      this.accessToken = data.accessToken
      this.user = data.user
      saveAccessToken(data.accessToken)
    },

    logout() {
      this.user = null
      this.accessToken = null
      removeAccessToken()
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
})
