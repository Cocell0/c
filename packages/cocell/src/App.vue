<template>
  <div :hidden="!generators.length" class="generators">
    <h2 class="text-center">Generators</h2>
    <ul>
      <li v-for="(name, index) in generators" :key="index">
        <Generator :name="name" />
      </li>
    </ul>
  </div>

  <h2 class="text-center my-4">Hub Chat</h2>
  <div class="perchance-chat-container" v-html="chat"></div>
</template>

<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import Generator from './components/Generator.vue'

const chat = computed(() => window.chat({
  channel: 'feedback',
  adminPasswordHash: 'c645c3fe3a1c516937d3bdd532f322cb41d9786a3e86754d5bf0e85c92675f05',
  adminFlair: 'Admin',
}))

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
