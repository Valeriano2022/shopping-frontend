import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
// import ProductsView from '@/views/products/ProductView.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    // {
    //   path: '/products',
    //   component: ProductsView,
    //   meta: { requiresAuth: true }
    // }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
    return '/products'
  }
})

export default router
