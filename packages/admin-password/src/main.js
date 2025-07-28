import 'virtual:uno.css'
import 'c-style'
import './assets/main.scss'

import { name } from '../package.json';
import { initialize } from 'core'

initialize(name);

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

