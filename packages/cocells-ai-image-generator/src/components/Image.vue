<template>
  <div class="image-container" :class="{ generated: image }">
    <transition name="fade">
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
@media (prefers-reduced-motion: no-preference) {

  .fade-enter-from,
  .fade-leave-to {
    scale: 1.4;
    opacity: 0;
  }

  .fade-enter-to,
  .fade-leave-from {
    scale: 1;
    opacity: 1;
  }
}

.image-container {
  position: relative;
  overflow: hidden;
  background-color: var(--surface);
  border-radius: var(--space-M);
  min-width: 280px;
  min-height: 280px;
  width: 280px;
  height: auto;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .badge {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(50%);
    padding: var(--space-SX) var(--space-B);
    margin: 0;
    background: light-dark(hsl(var(--base-hue), var(--base-saturation), 80%, 0.5),
        hsl(var(--base-hue), var(--base-saturation), 14%, 0.6));
    backdrop-filter: blur(var(--blur-S));
    border-radius: var(--space-B);
    text-align: center;
  }

  &.generated .badge {
    bottom: var(--space-B);
    transform: translateX(-50%) translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
}
</style>