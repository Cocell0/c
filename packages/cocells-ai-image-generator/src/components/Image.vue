<template>
  <div class="image-container">
    <img :src="image" :alt="`${prompt}`" />
    <div class="image-info">
      <p class="time">{{ time ? `Generated in ${time}` : '' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const image = ref('');
const time = ref();
const props = defineProps({
  prompt: {
    type: String,
    required: true
  }
});

(async () => {
  const startTime = Date.now();
  const timer = setInterval(() => {
    time.value = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
  }, 100)

  const result = await window.image({ prompt: props.prompt, width: 512, height: 768 });

  onUnmounted(() => {
    clearInterval(timer)
  })
  clearInterval(timer)
  time.value = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
  image.value = result || '';
})();
</script>

<style scoped lang="scss">
.image-container {
  position: relative;
  overflow: hidden;
  background-color: var(--surface);
  border-radius: var(--space-M);

  img {
    width: 280px;
    height: 280px;
    object-fit: cover;
  }

  .image-info {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: var(--space-S);
    color: white;
    background: linear-gradient(to top, hsl(0, 0%, 0%, 0.7), transparent);
    text-align: left;
  }
}
</style>