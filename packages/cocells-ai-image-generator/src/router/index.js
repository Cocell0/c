import { createRouter, createWebHashHistory } from 'vue-router'
import Images from '../views/Images/Index.vue'
import Create from '../views/Images/Create.vue'

const routes = [
  {
    path: '/',
    redirect: '/images/create'
  },
  {
    path: '/images',
    component: Images,
  },
  {
    path: '/images/create',
    component: Create,
  },
  {
    path: '/:pathMatch(.*)*',
    component: Create,
    redirect: '/images/create',
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
