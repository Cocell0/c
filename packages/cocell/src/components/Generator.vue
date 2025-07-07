<template>
  <transition-group name="generator">
    <a class="button" :href="`http://perchance.org/${name}`" v-if="generator" draggable="true">
      <img class="thumbnail" :src="`https://perchance.org/api/getGeneratorScreenshot?generatorName=${name}`" />
      <div class="detail">
        <h4 class="my-2">{{ generator.metaData.title || name }}</h4>
        <!-- <p v-if="generator.metaData.description" class="description">{{ generator.metaData.description }}</p> -->
        <!-- <div v-if="generator.metaData.tags && generator.metaData.tags.length" class="tags">
          <span v-for="tag in generator.metaData.tags" :key="tag" class="tag">{{ tag }}</span>
        </div> -->
        <small class="stats">{{ millify(generator.views) }} views • {{ lastEditRelative }}</small>
      </div>
    </a>
  </transition-group>
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

<style scoped lang="scss">
a {
  flex: 1;
  display: block;
  padding: var(--space-B);
  border-radius: var(--space-B);
  min-width: 300px;
  max-width: 300px;
  border: 1px solid var(--divider-opaque);

  @media (max-width: 1000px) {
    max-width: 100%;
  }

  img {
    border-radius: var(--space-S);
    width: 100%;
    height: auto;
    min-height: 170px;
    display: block;
    border: 1px solid var(--divider-opaque);
  }

  .description {
    max-height: 100px;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .generator-enter-active {
    transition: opacity 0.4s cubic-bezier(0.075, 0.82, 0.165, 1), scale 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  .generator-enter-from {
    opacity: 0;
    scale: 0.8;
  }

  .generator-enter-to {
    opacity: 1;
    scale: 1;
  }
}
</style>