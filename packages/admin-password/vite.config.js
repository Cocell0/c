import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import inlineSource from "vite-plugin-inline-source";

export default defineConfig({
  plugins: [
    UnoCSS(),
    viteSingleFile(),
    inlineSource(),
  ],
})