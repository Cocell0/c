<template>
  <DarkMode style="display: flex; margin: auto;"></DarkMode>
  <header class="text-center my-4">
    <h1>Hub</h1>
    <p>A hub to display all my public projects, and some other quirky stuff.</p>
    <p>My time:
      <span class="select-all">
        <span class="font-size-0">​</span>
        <code>{{ twelveHourTime }}</code>
        <span class="font-size-0">​</span>
      </span>
      /
      <span class="select-all">
        <span class="font-size-0">​</span>
        <code>{{ twenteyFourHourTime }}</code>
        <span class="font-size-0">​</span>
      </span>
    </p>
  </header>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Generator from './components/Generator.vue'
import DarkMode from 'core/src/vue/components/DarkMode.vue'

const time = ref(Date.now())
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    time.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const twelveHourTime = computed(() => {
  const date = new Date(time.value + 6 * 60 * 60 * 1000)
  let hours = date.getUTCHours()
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const seconds = date.getUTCSeconds().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${hours}:${minutes}:${seconds} ${ampm}`
})

const twenteyFourHourTime = computed(() => {
  return new Date(time.value + 6 * 60 * 60 * 1000).toISOString().substring(11, 19)
})

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
    'cocells-ai-image-generator',
    'ai-prompt',
    'admin-password',
  ]
}
</script>
