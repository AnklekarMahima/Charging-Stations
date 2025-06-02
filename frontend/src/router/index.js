import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Charger_List from '../components/Charger_List.vue';
import MapView from '../components/MapView.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false},
  },
  {
    path: '/chargers',
    name: 'Charger_List',
    component: Charger_List,
    meta: { requiresAuth: true },
  },
  {
    path: '/map',
    name: 'MapView',
    component: MapView,
    meta: { requiresAuth: true }
  }
  // Add other routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Add this here
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;