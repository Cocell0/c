import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import vue from "@vitejs/plugin-vue";
import { viteSingleFile } from "vite-plugin-singlefile";
import { perchanceSpecifics } from "core";
import path from "path";

export default defineConfig({
  plugins: [UnoCSS(), vue(), viteSingleFile(), perchanceSpecifics()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
