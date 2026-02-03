<template>
  <span class="tooltip">
    <slot></slot>
    <Transition name="fade">
      <span
        class="tooltip-text"
        :class="props.position"
        :style="props.tooltipStyle"
        aria-hidden="true"
        inert
      >
        {{ props.text }}
      </span>
    </Transition>
  </span>
</template>

<script setup>
const props = defineProps({
  text: String,
  position: {
    type: String,
    default: "top",
    validator: (value) => ["top", "bottom", "left", "right"].includes(value),
  },
  tooltipStyle: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.tooltip {
  --tooltip-in-duration: 120ms;
  --tooltip-out-duration: 100ms;
  --tooltip-in-delay: 320ms;
  --tooltip-out-delay: 60ms;
  position: relative;

  .tooltip-text {
    position: absolute;
    z-index: var(--z__tooltip);
    width: max-content;
    height: max-content;
    background-color: var(--color__surface--emphasis);
    border-radius: var(--rounding--A);
    padding: var(--spacing--B);
    opacity: 0;
    transform: scale(0.95);
    transform-origin: center;
    will-change: opacity, transform;

    &.top {
      top: calc(-100% - var(--spacing--B));
    }
    &.bottom {
      inset: 0;
      top: calc(100% + var(--spacing--B));
    }
    &.left {
      right: calc(100% + var(--spacing--B));
    }
    &.right {
      left: calc(100% + var(--spacing--B));
    }
  }

  /* Outro */
  &:not(:hover):not(:focus-within) {
    .tooltip-text {
      animation-name: tooltip-out;
      animation-duration: var(--tooltip-out-duration);
      animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
      animation-fill-mode: both;
      animation-delay: var(--tooltip-out-delay);
    }
  }

  /* Intro */
  &:hover,
  &:focus-within {
    .tooltip-text {
      animation-name: tooltip-in;
      animation-duration: var(--tooltip-in-duration);
      animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
      animation-fill-mode: both;
      animation-delay: var(--tooltip-in-delay);
    }
  }
}

@keyframes tooltip-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes tooltip-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tooltip {
    .tooltip-text {
      animation: none !important;
      transition:
        opacity 0ms linear,
        transform 0ms linear;
    }

    /* Intro */
    &:hover,
    &:focus-within {
      .tooltip-text {
        opacity: 1;
        transform: scale(1);
        transition-delay: var(--tooltip-in-delay);
      }
    }

    /* Outro */
    &:not(:hover):not(:focus-within) {
      .tooltip-text {
        opacity: 0;
        transform: scale(0.95);
        transition-delay: var(--tooltip-out-delay);
      }
    }
  }
}
</style>
