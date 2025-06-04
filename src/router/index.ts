import { createRouter, createWebHistory } from 'vue-router'
import AddRoleView from '../components/AddRole.vue'
import AddUserView from '../components/AddUser.vue'
import DashboardView from '../components/Dashboard.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/roles', component: AddRoleView },
  { path: '/usuarios', component: AddUserView },
  { path: '/dashboard', component: DashboardView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
