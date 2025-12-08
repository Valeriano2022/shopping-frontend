<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
      <h1 class="text-2xl font-bold mb-6 text-center">Sign In</h1>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>
      </form>
      <p class="mt-4 text-center text-sm">
        Don't have an account?
        <RouterLink to="/register" class="text-blue-600 font-medium">Create one</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLogin } from '@/composables/useLogin'

const router = useRouter()
const { login, loading } = useLogin()

const form = reactive({
  email: '',
  password: '',
})

const submit = async () => {
  const ok = await login(form)
  if (ok) router.push('/products')
}
</script>
