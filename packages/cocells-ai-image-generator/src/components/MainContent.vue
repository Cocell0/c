<template>
  <main :class="{ 'generation-started': state.generationStarted }">
    <div class="prompt-area" @click="focusPromptBox">
      <label for="prompt" class="w-full block text-center">Prompt</label>
      <div class="prompt-container">
        <textarea name="prompt" id="prompt" ref="promptBox" v-model="prompt"
          @keydown="if ($event.key === 'Enter' && !$event.shiftKey) { $event.preventDefault(); createImage(); }"
          placeholder="Describe your image"></textarea>
        <!--
        A virtual text area to perform accurate measurement of the scroll height needed for the original text area
        This is done because the original text area has transitions which can cause incorrect scroll height calculations due to interpolation
          -->
        <label for="virtual-prompt">Virtual prompt</label>
        <textarea name="virtual-prompt" id="virtual-prompt" ref="virtualPromptBox"
          aria-label="This is not meant for user interaction" readonly tabindex="-1" inert></textarea>
      </div>
      <div class="option-container">
        <button class="button--icon" aria-label="Create image" @click="createImage" :disabled="prompt.trim() === ''">
          <span class="i-material-symbols-add-rounded"></span>
        </button>
      </div>
    </div>
    <div class="generated-image-container" role="region" aria-label="Generated images" v-if="state.generationStarted">
      <Image v-for="(img) in images" :key="img.id" :prompt="img.prompt" />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import Image from './Image.vue'

const state = ref({
  generationStarted: false,
});

const promptBox = ref(null)
const virtualPromptBox = ref(null)
const prompt = ref('')
const images = ref([])

onMounted(() => {
  promptBox.value.addEventListener('input', () => {
    if (!promptBox.value) return

    virtualPromptBox.value.value = promptBox.value.value

    promptBox.value.style.height = 'auto'
    promptBox.value.style.height = `${virtualPromptBox.value.scrollHeight}px`
  })
})

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