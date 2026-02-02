<template>
  <span
    class="tooltip"
    ref="tooltip"
    @focusin="openWithDelay"
    @focusout="closeImmediately"
    @mouseenter="openWithDelay"
    @mouseleave="closeImmediately"
    @touchstart="openWithDelay"
  >
    <slot></slot>
    <Transition name="fade">
      <span v-if="isOpen" class="tooltip-text" aria-hidden="true" inert>
        {{ props.text }}
      </span>
    </Transition>
  </span>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  text: {
    type: String,
  },
});

const tooltip = ref(null);
const isOpen = ref(false);
const delay = 350;
let timer = null;

function openWithDelay() {
  // Clear existing timer
  clearTimeout(timer);
  timer = setTimeout(() => {
    isOpen.value = true;
  }, delay);
}

function closeImmediately() {
  clearTimeout(timer);
  isOpen.value = false;
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 120ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tooltip {
  position: relative;

  .tooltip-text {
    position: absolute;
    z-index: var(--z__tooltip);
    inset: 0;
    width: max-content;
    height: max-content;
    background-color: var(--color__surface--emphasis);
    border-radius: var(--rounding--A);
    padding: var(--spacing--B);
  }
}
</style>
