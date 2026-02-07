<template>
  <span
    ref="contentElement"
    class="popover__content"
    :data-position="popover.position.value"
  >
    <slot />
  </span>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";

const contentElement = ref(null);

const popover = inject("popover");

onMounted(() => {
  popover.contentElement.value = contentElement.value;
});
</script>

<style lang="scss" scoped>
.popover__content {
  position: absolute;
  z-index: var(--z-index);
  width: max-content;
  height: max-content;

  &[data-position="top"] {
    bottom: calc(100% + var(--offset));
    left: 50%;
    transform: translateX(-50%);
    transform-origin: center bottom;
  }

  &[data-position="top left"] {
    bottom: calc(100% + var(--offset));
    left: 0;
    transform-origin: left bottom;
    transform: translateX(0);
  }

  &[data-position="top right"] {
    bottom: calc(100% + var(--offset));
    right: 0;
    transform-origin: right bottom;
    transform: translateX(0);
  }

  &[data-position="bottom"] {
    top: calc(100% + var(--offset));
    left: 50%;
    transform: translateX(-50%);
    transform-origin: center top;
  }

  &[data-position="bottom left"] {
    top: calc(100% + var(--offset));
    left: 0;
    transform-origin: left top;
    transform: translateX(0);
  }

  &[data-position="bottom right"] {
    top: calc(100% + var(--offset));
    right: 0;
    transform-origin: right top;
    transform: translateX(0);
  }

  &[data-position="left"] {
    right: calc(100% + var(--offset));
    top: 50%;
    transform: translateY(-50%);
    transform-origin: left center;
  }

  &[data-position="left top"] {
    right: calc(100% + var(--offset));
    top: 0;
    transform-origin: left top;
    transform: translateY(0);
  }

  &[data-position="left bottom"] {
    right: calc(100% + var(--offset));
    bottom: 0;
    transform-origin: left bottom;
    transform: translateY(0);
  }

  &[data-position="right"] {
    left: calc(100% + var(--offset));
    top: 50%;
    transform: translateY(-50%);
    transform-origin: right center;
  }

  &[data-position="right top"] {
    left: calc(100% + var(--offset));
    top: 0;
    transform-origin: right top;
    transform: translateY(0);
  }

  &[data-position="right bottom"] {
    left: calc(100% + var(--offset));
    bottom: 0;
    transform-origin: right bottom;
    transform: translateY(0);
  }
}
</style>
