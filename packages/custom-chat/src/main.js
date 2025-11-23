import 'virtual:uno.css'
import 'core/src/font.css'
import 'c-style'
import './assets/main.scss'
import 'core/src/paramount.css'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

router.afterEach(route => {
  const title = route.meta?.title;
  if (title) document.title = title;

  if (import.meta.env.PROD) {
    if (window.gtag) gtag('config', 'G-QCJD60XX2F', { page_path: route.fullPath })
  }
})

const app = createApp(App);
app.use(router)
app.use(createPinia())
app.use(VueVirtualScroller)
app.mount('#app')
