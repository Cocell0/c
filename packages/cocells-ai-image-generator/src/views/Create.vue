<template>
  <div class="router-wrapper">
    <main :class="{ 'generation-started': state.generationStarted }">
      <div
        class="generated-image-container"
        role="region"
        aria-label="Generated images"
      >
        <TransitionGroup name="image">
          <Image
            v-for="image in images"
            :key="image.id"
            :prompt="image.prompt"
          />
        </TransitionGroup>
      </div>
      <div class="prompt-area-wrapper">
        <div class="c-surface--emphasis prompt-area">
          <div class="option-container">
            <button
              class="button--icon"
              aria-label="Open settings"
              @click="
                uiStore.isConfigurationOpen = !uiStore.isConfigurationOpen
              "
            >
              <span class="i-material-symbols-settings"></span>
            </button>
          </div>
          <div class="prompt-container">
            <label for="prompt" class="w-full block text-center">Prompt</label>
            <textarea
              name="prompt"
              id="prompt"
              ref="promptBox"
              v-model="prompt"
              @keydown="
                if ($event.key === 'Enter' && !$event.shiftKey) {
                  $event.preventDefault();
                  createImage();
                }
              "
              placeholder="Describe your image..."
            ></textarea>
          </div>
          <div class="option-container">
            <button
              class="button--icon button--suggested-action"
              aria-label="Create image"
              @click="createImage"
              :disabled="prompt.trim() === ''"
            >
              <span class="i-material-symbols-arrow-upward-rounded"></span>
            </button>
          </div>
        </div>
      </div>
      <Modal v-model:open="uiStore.isConfigurationOpen" title="Configuration">
        Configurations
      </Modal>
    </main>
  </div>
</template>

<script setup>
import DarkMode from "core/src/vue/components/DarkMode.vue";
import Modal from "core/src/vue/components/Modal.vue";
import { useUiStore } from "@/store/useUiStore";
import { useConfigurationStore } from "@/store/useConfigurationStore";
import { ref, TransitionGroup } from "vue";
import Image from "@/components/Image.vue";

const state = ref({
  generationStarted: false,
});

const promptBox = ref(null);
const prompt = ref("");
const images = ref([]);

function createImage() {
  if (prompt.value.trim() !== "") {
    state.value.generationStarted = true;
    images.value.push({
      id: crypto.randomUUID(),
      prompt: prompt.value,
    });
  }
}

const uiStore = useUiStore();
const configurationStore = useConfigurationStore();

function toggleConfigurationBar() {
  uiStore.isConfigurationOpen = !uiStore.isConfigurationOpen;
}
</script>

<style lang="scss">
@media (prefers-reduced-motion: no-preference) {
  .image-enter-from,
  .image-leave-to {
    scale: 1.4;
    opacity: 0;
  }

  .image-enter-to,
  .image-leave-from {
    scale: 1;
    opacity: 1;
  }
}
</style>
