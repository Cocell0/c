import 'virtual:uno.css'
import 'core/src/font.css'
import 'core/src/base.css'
import 'core/src/component.css'
import './assets/main.scss'
import 'core/src/paramount.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App);
app.use(router)
app.use(createPinia())
app.mount('#app')
