<template>
  <span class="overflow-menu-wrapper" @keydown="blur" ref="wrapper">
    <button
      ref="button"
      class="button--icon"
      :aria-label="props.ariaLabel"
      :title="props.title"
      @mousedown="checkFocus"
      @click="handleClick"
    >
      <span class="i-material-symbols:more-vert" aria-hidden inert></span>
    </button>
    <div
      class="overflow-menu-inner-wrapper"
      v-if="$slots.default"
      :style="props.style"
    >
      <div class="overflow-menu">
        <slot></slot>
      </div>
    </div>
  </span>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  style: String,
  ariaLabel: {
    type: String,
    default: "More options",
  },
  title: {
    type: String,
    default: "More options",
  },
});

const wrapper = ref(null);
const button = ref(null);
let wasFocused = false;

function checkFocus() {
  wasFocused = document.activeElement === button.value;
}

function handleClick() {
  if (wasFocused) {
    button.value.blur();
  }
}

function blur(event) {
  if (event.key === "Escape") {
    document.activeElement.blur();
  }
}
</script>

<style scoped lang="scss">
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.overflow-menu-wrapper {
  position: relative;

  .overflow-menu-inner-wrapper {
    visibility: hidden;
    position: absolute;
    margin-block: var(--spacing--A);
    background-color: var(--color__surface--emphasis);
    /* box-shadow: 0 0 var(--spacing--B)
      light-dark(oklch(0.75 0 0), oklch(0.25 0 0)); */
    border-radius: calc(var(--rounding--A) * 1.155);
    min-height: var(--min-dimension);
    min-width: var(--min-dimension);
    width: max-content;
    z-index: 0;
    animation: fade-out 120ms ease-out forwards;
  }

  &:focus-within {
    .overflow-menu-inner-wrapper {
      visibility: visible;
      animation: fade-in 120ms ease-in forwards;
    }
  }
}

.overflow-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing--A);
  padding: var(--spacing--B);

  > * {
    flex: 1;
  }
}
</style>
