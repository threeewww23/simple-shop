import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Home from '@/presentation/screens/Home.vue'
import Room from '@/presentation/screens/Room.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/product/:id',
    component: Room,
    props: route => ({
      id: parseInt(route.params.id as string, 10),
    }),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
