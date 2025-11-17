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
    path: '/c',
    name: 'chat-empty',
    component: Chat
  },
  {
    path: '/c/:id',
    name: 'chat',
    component: Chat
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
