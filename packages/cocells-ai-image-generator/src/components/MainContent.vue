<template>
  <main :class="{ 'generation-started': state.generationStarted }">
    <div class="generated-image-container" role="region" aria-label="Generated images">
      <Image v-for="(image) in images" :key="image.id" :prompt="image.prompt" />
    </div>
    <div class="prompt-area-wrapper">
      <div class="prompt-area" @click="focusPromptBox">
        <label for="prompt" class="w-full block text-center">Prompt</label>
        <div class="prompt-container">
          <textarea name="prompt" id="prompt" ref="promptBox" v-model="prompt"
            @keydown="if ($event.key === 'Enter' && !$event.shiftKey) { $event.preventDefault(); createImage(); }"
            placeholder="Describe your image"></textarea>
        </div>
        <div class="option-container">
          <button class="button--icon" aria-label="Create image" @click="createImage" :disabled="prompt.trim() === ''">
            <span class="i-material-symbols-add-rounded"></span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import Image from './Image.vue'

const state = ref({
  generationStarted: false,
});

const promptBox = ref(null)
const prompt = ref('')
const images = ref([])

function focusPromptBox(event) {
  if (event.target.classList.contains('prompt-area') ||
    event.target.classList.contains('prompt-container') ||
    event.target.classList.contains('option-container')) {
    if (promptBox.value) promptBox.value.focus()
  }
}

function createImage() {
  if (prompt.value.trim() !== '') {
    state.value.generationStarted = true;
    images.value.push({
      id: crypto.randomUUID(),
      prompt: prompt.value,
    });
  }
}
</script>