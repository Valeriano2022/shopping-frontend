<template>
  <nav class="w-full bg-white border-b border-slate-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex items-center justify-between h-20">
        <div class="flex items-center gap-10">
          <RouterLink to="/products" class="flex items-center">
            <img src="@/assets/logo.svg" alt="Logo" class="h-8 w-auto" />
            <span class="ml-3 text-xl font-semibold text-slate-900">ShopHype</span>
          </RouterLink>

          <div class="hidden lg:flex items-center gap-8 text-slate-700 font-medium">
            <RouterLink class="hover:text-black transition" to="/products">Products</RouterLink>
            <RouterLink v-if="isAuthenticated" class="hover:text-black transition" to="/orders"
              >Orders</RouterLink
            >
          </div>
        </div>

        <div class="flex-1 flex justify-center px-8">
          <div class="relative w-full max-w-xl">
            <input
              v-model="query"
              type="text"
              placeholder="Search"
              class="w-full h-12 rounded-full border border-slate-300 pl-14 pr-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700"
            />
            <svg
              class="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.3-4.3"></path>
            </svg>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <RouterLink to="/cart" class="relative p-2 rounded-full hover:bg-slate-100 transition">
            <svg
              class="w-6 h-6 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13zm0 0l-2 7h14l-2-7m-8 0a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
            <div v-if="isAuthenticated">
              <span
                v-if="cartCount > 0"
                class="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full"
              >
                {{ cartCount }}
              </span>
            </div>
          </RouterLink>

          <div v-if="isAuthenticated" class="relative">
            <button
              @click="toggleDropdown"
              class="block rounded-full overflow-hidden ring-2 ring-slate-200 hover:ring-slate-300 transition"
            >
              <img src="https://avatar.iran.liara.run/public/32" class="h-10 w-10 object-cover" />
            </button>
            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-3 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50"
            >
              <RouterLink
                to="/profile"
                class="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                @click="closeDropdown"
              >
                Profile
              </RouterLink>

              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          </div>
          <RouterLink
            v-else
            to="/login"
            class="px-5 py-2 bg-slate-900 text-white rounded-full hover:bg-black transition font-medium"
          >
            Sign In
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCartCount } from '@/composables/useCartCount'
import { useLogout } from '@/composables/useLogout'
import { useSearchStore } from '@/stores/useSearchStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const isAuthenticated = computed(() => auth.isAuthenticated)
const { count: cartCount } = useCartCount()
const searchStore = useSearchStore()

const query = ref('')

watch(query, (val) => (searchStore.query = val))

const dropdownOpen = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const { logout } = useLogout()

const router = useRouter()

const handleLogout = () => {
  closeDropdown()
  logout()
  router.push('/products')
}
</script>
