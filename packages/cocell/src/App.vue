<template>
  <div :hidden="!generatorStats.length" class="generators">
    <h2 class="text-center">Generators</h2>
    <ul>
      <li v-for="(generator, index) in generatorStats" :key="index">
        <a class="button" :href="`http://perchance.org/${generator.name}`">
          <img class="thumbnail"
            :src="`https://perchance.org/api/getGeneratorScreenshot?generatorName=${generator.name}`" />
          <div class="detail">
            <h4 class="m0">{{ generator.metaData.title || generator.name }}</h4>
          </div>
        </a>
      </li>
    </ul>
  </div>
  <div class="chat" v-html="chatHtml"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { computed } from 'vue'

const chatHtml = computed(() => (window.chat || (() => 'Chat not defined'))())

const generators = ref([])
const generatorStats = ref([])

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

onMounted(async () => {
  const fetchStats = name =>
    fetch(`https://perchance.org/api/getGeneratorStats?name=${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then(json => json.data)

  generatorStats.value = await Promise.all(generators.value.map(fetchStats))
})
</script>
