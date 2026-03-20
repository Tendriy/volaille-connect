import { createRouter, createWebHistory } from 'vue-router'

// Import des composants
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Lots from '../views/Lots.vue'
import LotDetail from '../views/LotDetail.vue'
import Stock from '../views/Stock.vue'
import Vaccins from '../views/Vaccins.vue'
import Ventes from '../views/Ventes.vue'

// Définition des routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/lots',
    name: 'Lots',
    component: Lots,
    meta: { requiresAuth: true }
  },
  {
    path: '/lots/:id',
    name: 'LotDetail',
    component: LotDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/stock',
    name: 'Stock',
    component: Stock,
    meta: { requiresAuth: true }
  },
  {
    path: '/vaccins',
    name: 'Vaccins',
    component: Vaccins,
    meta: { requiresAuth: true }
  },
  {
    path: '/ventes',
    name: 'Ventes',
    component: Ventes,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware de navigation - Version corrigée (sans warning)
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  console.log('Navigation vers:', to.path)
  console.log('Token existe:', !!token)
  console.log('Requiert authentification:', requiresAuth)
  
  if (requiresAuth && !token) {
    console.log('Redirection vers login')
    return '/login'
  }
  
  return true
})

export default router