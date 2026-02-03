<template>
  <span class="tooltip">
    <slot></slot>
    <span
      v-if="!props.disable"
      class="tooltip-text"
      :class="props.position"
      :style="props.tooltipStyle"
      aria-hidden="true"
      inert
    >
      {{ props.text }}
    </span>
  </span>
</template>

<script setup>
const props = defineProps({
  text: String,
  position: {
    type: String,
    default: "top center",
  },
  tooltipStyle: {
    type: String,
  },
  disable: {
    type: Boolean,
    default: false,
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
    max-width: 200px;
    height: max-content;
    font-size: 0.8rem;
    font-weight: normal;
    background-color: var(--color__surface--emphasis);
    border: 2px solid var(--color__border-divider--opaque);
    border-radius: calc(var(--base__rounding) * 0.72);
    padding: var(--spacing--B) var(--spacing--C);
    opacity: 0;
    transform-origin: center;
    will-change: opacity, transform;

    &.top {
      bottom: calc(100% + var(--spacing--B));
      transform-origin: center bottom;
      left: 0;
      right: 0;
      transform: translateX(0);

      &.center {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        transform-origin: center bottom;
      }
    }
    &.bottom {
      top: calc(100% + var(--spacing--B));
      transform-origin: center top;
      left: 0;
      right: 0;
      transform: translateX(0);

      &.center {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        transform-origin: center top;
      }
    }
    &.left {
      right: calc(100% + var(--spacing--B));
      transform-origin: left center;
      top: 0;
      bottom: 0;
      transform: translateY(0);

      &.center {
        top: 50%;
        bottom: auto;
        transform: translateY(-50%);
        transform-origin: left center;
      }
    }
    &.right {
      left: calc(100% + var(--spacing--B));
      transform-origin: right center;
      top: 0;
      bottom: 0;
      transform: translateY(0);

      &.center {
        top: 50%;
        bottom: auto;
        transform: translateY(-50%);
        transform-origin: right center;
      }
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
  }
  to {
    opacity: 1;
  }
}

@keyframes tooltip-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
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
        transition-delay: var(--tooltip-in-delay);
      }
    }

    /* Outro */
    &:not(:hover):not(:focus-within) {
      .tooltip-text {
        opacity: 0;
        transition-delay: var(--tooltip-out-delay);
      }
    }
  }
}
</style>
