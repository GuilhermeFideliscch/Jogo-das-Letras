import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../App.vue'
import ModoClassico from '../components/ModoClassico.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/classico', component: ModoClassico }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
