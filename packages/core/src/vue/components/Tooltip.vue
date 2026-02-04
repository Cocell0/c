<template>
  <div class="tooltip">
    <Popover
      :position="props.position"
      :contentAttributes="{ inert: true, 'aria-hidden': 'true' }"
    >
      <slot />
      <div
        class="tooltip-text"
        :style="props.tooltipStyle"
        v-if="!props.disable && props.text"
      >
        {{ props.text }}
      </div>
    </Popover>
  </div>
</template>

<script setup>
import Popover from "./Popover.vue";

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

  .popover__container {
    --z-index: var(--z__tooltip);
  }

  .tooltip-text {
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
    will-change: opacity, transform;
    transition: opacity var(--tooltip-out-duration) cubic-bezier(0.2, 0, 0.2, 1);

    /* Outro */
    transition-delay: var(--tooltip-out-delay);
  }

  /* Intro */
  &:hover,
  &:focus-within {
    .tooltip-text {
      opacity: 1;
      transition: opacity var(--tooltip-in-duration)
        cubic-bezier(0.2, 0, 0.2, 1);
      transition-delay: var(--tooltip-in-delay);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .tooltip .tooltip-text {
    transition: none !important;
  }

  .tooltip:hover .tooltip-text,
  .tooltip:focus-within .tooltip-text {
    transition-delay: var(--tooltip-in-delay) !important;
  }

  .tooltip:not(:hover):not(:focus-within) .tooltip-text {
    transition-delay: var(--tooltip-out-delay) !important;
  }
}
</style>
