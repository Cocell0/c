<template>
  <li v-if="generator">
    <a class="button" :href="`http://perchance.org/${name}`">
      <img class="thumbnail" :src="`https://perchance.org/api/getGeneratorScreenshot?generatorName=${name}`" />
      <div class="detail">
        <h4 class="m0">{{ generator.metaData.title || name }}</h4>
        <p v-if="generator.metaData.description" class="description">{{ generator.metaData.description }}</p>
        <!-- <div v-if="generator.metaData.tags && generator.metaData.tags.length" class="tags">
          <span v-for="tag in generator.metaData.tags" :key="tag" class="tag">{{ tag }}</span>
        </div> -->
        <small class="stats">{{ millify(generator.views) }} views • {{ lastEditRelative }}</small>
      </div>
    </a>
  </li>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import millify from 'millify'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const generator = ref(null)
let intervalId = null

const fetchGenerator = async (name) => {
  const res = await fetch(`https://perchance.org/api/getGeneratorStats?name=${encodeURIComponent(name)}`)
  const json = await res.json()
  generator.value = json.data
}

const lastEditRelative = computed(() =>
  generator.value?.lastEditTime
    ? dayjs(generator.value.lastEditTime).fromNow()
    : ''
)

const startInterval = (name) => {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(() => {
    fetchGenerator(name)
  }, 2 * 60 * 1000)
}

onMounted(() => {
  fetchGenerator(props.name)
  startInterval(props.name)
})

watch(() => props.name, (newName) => {
  fetchGenerator(newName)
  startInterval(newName)
})

import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>