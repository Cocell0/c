<template>
  <div class="image-container c-surface" :class="{ generated: image }">
    <transition name="image">
      <img v-if="image" :src="image" :alt="`${prompt}`" />
    </transition>
    <p class="badge"><small>{{ time ? `${time}` : '' }} seconds</small></p>
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

const startTime = Date.now();
const timer = setInterval(() => {
  time.value = ((Date.now() - startTime) / 1000).toFixed(2);
}, 100)

onUnmounted(() => {
  clearInterval(timer);
});

(async () => {
  const result = await window.image({ prompt: props.prompt, width: 512, height: 768 });
  clearInterval(timer);
  time.value = ((Date.now() - startTime) / 1000).toFixed(2);
  image.value = result || '';
})();
</script>

<style scoped lang="scss">
@media (prefers-reduced-motion: no-preference) {

  .image-enter-from,
  .image-leave-to {
    scale: 0.8;
    opacity: 0;
  }

  .image-enter-to,
  .image-leave-from {
    scale: 1;
    opacity: 1;
  }
}

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: calc(var(--spacing-D) * 2);
  min-width: 256px;
  min-height: 256px;
  width: 256px;
  height: auto;

  img {
    width: 256px;
    height: auto;
    object-fit: cover;
  }

  .badge {
    --rounding: calc(calc(var(--base__spacing) * 4.5));
    white-space: nowrap;
    position: absolute;
    min-width: 125px;
    bottom: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(50%);
    padding: var(--spacing-A) var(--spacing-C);
    margin: 0;
    background: light-dark(oklch(84% var(--base__chroma) var(--base__hue) / 0.5),
        oklch(22% var(--base__chroma) var(--base__hue) / 0.6));
    backdrop-filter: blur(var(--blur-A));
    border-radius: var(--rounding);
    text-align: center;
  }

  &.generated .badge {
    bottom: var(--spacing-C);
    transform: translateX(-50%) translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
}
</style>