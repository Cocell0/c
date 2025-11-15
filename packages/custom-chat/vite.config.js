import { name } from './package.json';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { perchanceSpecifics } from 'core'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    viteSingleFile(),
    perchanceSpecifics(name),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
})
