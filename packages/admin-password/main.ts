import 'virtual:uno.css'
import 'core/src/base.css'
import 'core/src/component.css'
import './assets/styles.scss'

import { name } from './package.json' assert { type: 'json' };
import { initialize } from 'core'

initialize(name);