<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
      
      <h1 class="text-2xl font-bold mb-6 text-center">Create Account</h1>

      <form @submit.prevent="submit">

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

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
          {{ loading ? "Creating account..." : "Register" }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm">
        Already have an account?
        <RouterLink to="/login" class="text-blue-600 font-medium">Sign in</RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRegister } from '@/composables/useRegister'

const router = useRouter()
const { register, loading, success } = useRegister()

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const submit = async () => {
  await register(form)
}

watch(success, (val) => {
  if (val) router.push('/login')
})
</script>
