import { createRouter, createWebHashHistory } from 'vue-router'
import Images from '@/views/Images.vue'
import Create from '@/views/Create.vue'

const routes = [
  {
    path: '/',
    redirect: '/create'
  },
  {
    path: '/images',
    component: Images,
  },
  {
    path: '/create',
    component: Create,
  },
  {
    path: '/:pathMatch(.*)*',
    component: Create,
    redirect: '/create',
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
