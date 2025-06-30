<template>
  <div :hidden="!generators.length" class="generators">
    <h2 class="text-center">Generators</h2>
    <ul>
      <Generator v-for="(name, index) in generators" :key="index" :name="name" />
    </ul>
  </div>

  <h2 class="text-center my-4">Hub Chat</h2>
  <div class="perchance-chat-container" v-html="chat"></div>
</template>

<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import Generator from './components/Generator.vue'

const chat = computed(window.chat)

const generators = ref([])

if (window.generators) {
  generators.value = Object.values(window.generators).map(g => g.$text)
}

if (generators.value.length === 0) {
  generators.value = [
    'ai-chat-modern',
    'ai-prompt',
    'cocells-ai-image-generator',
    'admin-password'
  ]
}
</script>
