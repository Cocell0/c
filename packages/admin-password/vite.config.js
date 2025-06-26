import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { inlineVue } from "core";

export default defineConfig({
  plugins: [
    UnoCSS(),
    viteSingleFile(),
    inlineVue(),
  ],
})