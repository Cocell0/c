<template>
  <a class="button generator" :href="`https://perchance.org/${props.name}`" v-if="generator">
    <img loading="lazy" class="thumbnail"
      :src="`https://perchance.org/api/getGeneratorScreenshot?generatorName=${props.name}`"
      :alt="`Screenshot of ${props.name}`" />
    <div class="detail">
      <h4 class="my-2">{{ generator.title || props.name }}</h4>
      <small class="stats">{{ millify(generator.views) }} views • {{ editTime }}</small>
    </div>
  </a>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import millify from 'millify'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const props = defineProps({
  name: {
    type: String,
  },
})

let generator = ref();
let editTime = ref();
let fetchGeneratorDataInterval = null;

async function fetchGeneratorData() {
  const res = await fetch(`https://perchance.org/api/getGeneratorStats?name=${props.name}`);
  const data = await res.json();

  return {
    title: data.data.metaData.title,
    views: data.data.views,
    editTime: data.data.lastEditTime,
    description: data.data.metaData.description,
    image: data.data.metaData.image,
    tags: data.data.metaData.tags,
    id: data.data.publicId,
  }
}

if (props.name) {
  fetchGeneratorData().then(generatorData => {
    generator.value = generatorData;
    editTime.value = dayjs(generatorData.editTime).fromNow();

    fetchGeneratorDataInterval = setInterval(() => {
      fetchGeneratorData().then(generatorData => {
        generator.value = generatorData;
        editTime.value = dayjs(generatorData.editTime).fromNow();
      })
    }, 60000);
  })
}

onUnmounted(() => {
  if (fetchGeneratorDataInterval) clearInterval(fetchGeneratorDataInterval)
})
</script>

<style scoped lang="scss">
.generator {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  text-align: left;
  padding: var(--space-B);
  border-radius: var(--space-B);
  border: 1px solid var(--divider-opaque);

  @media (max-width: 768px) {
    max-width: 100%;
  }

  img {
    border-radius: var(--space-S);
    width: 100%;
    height: auto;
    min-height: 170px;
    display: block;
    border: 1px solid var(--divider-opaque);
    width: 280px;
    height: auto;
  }

  .detail {
    width: 100%;
  }
}
</style>