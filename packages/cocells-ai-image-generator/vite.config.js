import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { perchanceSpecifics } from 'core'

export default defineConfig({
  plugins: [
    UnoCSS(),
    vue(),
    viteSingleFile(),
    perchanceSpecifics(),
  ],
})
