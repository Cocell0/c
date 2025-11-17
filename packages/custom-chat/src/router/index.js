import { createRouter, createWebHashHistory } from 'vue-router'
import Chat from '@/views/Chat.vue'
import Home from '@/views/Home.vue'

const routes = [
  {
    name: 'Home',
    path: '/',
    component: Home,
  },
  {
    name: 'Chat',
    path: '/c',
    component: Chat,
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
