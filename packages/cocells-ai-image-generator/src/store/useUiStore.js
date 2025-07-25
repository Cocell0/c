import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    isConfigurationOpen: false,
  }),
});