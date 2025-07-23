import { defineStore } from "pinia";

export const useConfigurationStore = defineStore("configuration", {
  state: () => ({
    prompt: "",
    negativePrompt: "",
    seed: null,
    batch: 1,
    size: [
      {
        name: "Portrait",
        width: 512,
        height: 768,
      },
      {
        name: "Landscape",
        width: 768,
        height: 512,
      },
      {
        name: "Square",
        width: 512,
        height: 512,
      },
    ],
  }),
});