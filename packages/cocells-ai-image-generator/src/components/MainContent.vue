<template>
  <main :class="{ 'generation-started': state.generationStarted }">
    <div class="prompt-area" @click="focusPromptBox">
      <label for="prompt" class="w-full block text-center">Prompt</label>
      <div class="prompt-container">
        <textarea name="prompt" id="prompt" ref="promptBox" v-model="prompt"
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
        <button class="button--icon" aria-label="Open configurations" @click="toggleConfigurationbar">
          <span class="i-material-symbols-tune-rounded"></span>
        </button>
        <button class="button--icon" aria-label="Create image" @click="createImage" :disabled="prompt.trim() === ''">
          <span class="i-material-symbols-add-rounded"></span>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'

const emit = defineEmits(['toggle-configuration-bar']);

const toggleConfigurationbar = () => {
  emit('toggle-configuration-bar')
};

const state = ref({
  generationStarted: false,
});

const promptBox = ref(null)
const virtualPromptBox = ref(null)
const prompt = ref('')

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
  }
}
</script>