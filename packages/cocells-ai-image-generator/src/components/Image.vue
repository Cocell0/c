<template>
  <div class="image-container">
    <img :src="image" :alt="`${prompt}`" />
    <p class="time"><small>{{ time ? `${time}` : '' }} seconds</small></p>
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
    time.value = ((Date.now() - startTime) / 1000).toFixed(2);
  }, 100)

  const result = await window.image({ prompt: props.prompt, width: 512, height: 768 });

  onUnmounted(() => {
    clearInterval(timer)
  })
  clearInterval(timer)
  time.value = ((Date.now() - startTime) / 1000).toFixed(2);
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

  .time {
    position: absolute;
    bottom: var(--space-B);
    left: 50%;
    transform: translateX(-50%);
    padding: var(--space-SX);
    margin: 0;
    background: light-dark(
      hsl(var(--base-hue), var(--base-saturation), 80%, 0.5),
      hsl(var(--base-hue), var(--base-saturation), 14%, 0.6)
    );
    backdrop-filter: blur(var(--blur-S));
    border-radius: var(--space-B);
    text-align: center;
  }
}
</style>