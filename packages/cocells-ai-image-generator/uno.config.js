import { defineConfig } from "unocss";
import presetWind4 from "@unocss/preset-wind4";
import presetIcons from "@unocss/preset-icons";

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons()
  ],
});
