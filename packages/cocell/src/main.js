import 'virtual:uno.css'
import 'core/src/font.css'
import 'core/src/base.css'
import 'core/src/component.css'
import './assets/main.scss'

import { name } from '../package.json';
import { initialize } from 'core'

initialize(name);

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

