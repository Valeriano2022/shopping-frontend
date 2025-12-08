import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ProductView from '@/views/products/ProductView.vue'
import CartView from '@/views/cart/CartView.vue'
import OrdersView from '@/views/orders/OrderView.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import OrderDetailView from '@/views/orders/OrderDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/products',
    },
    {
      path: '/login',
      component: LoginView,
      meta: { noLayout: true },
    },
    {
      path: '/register',
      component: RegisterView,
      meta: { noLayout: true },
    },
    {
      path: '/products',
      component: ProductView,
    },
    {
      path: '/cart',
      component: CartView,
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      component: OrdersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:id',
      component: OrderDetailView,
      meta: { requiresAuth: true },
    },
  ],
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
