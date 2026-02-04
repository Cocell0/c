<template>
  <span
    class="overflow-menu-wrapper"
    ref="wrapper"
    @keydown.esc="isOpen = false"
    @focusout="handleFocusOut"
  >
    <Popover :position="props.position">
      <button
        ref="button"
        :class="props.label ? '' : 'button--icon'"
        :aria-label="props.ariaLabel"
        aria-haspopup="menu"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
        :disabled="props.disable"
      >
        <span class="label" v-if="props.label">{{ props.label }}</span>
        <span
          :class="
            props.label
              ? 'i-material-symbols:keyboard-arrow-down-rounded'
              : 'i-material-symbols:more-vert'
          "
          aria-hidden="true"
        ></span>
      </button>

      <Transition name="fade">
        <div
          v-if="isOpen && $slots.default"
          class="overflow-menu-inner-wrapper"
          :class="props.position"
          :style="props.menuStyle"
        >
          <div class="overflow-menu" role="menu" @click="isOpen = false">
            <slot></slot>
          </div>
        </div>
      </Transition>
    </Popover>
  </span>
</template>

<script setup>
import { ref } from "vue";
import Popover from "./Popover.vue";

const props = defineProps({
  menuStyle: {
    type: String,
  },
  ariaLabel: {
    type: String,
    default: "More options",
  },
  label: {
    type: String,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: "bottom",
  },
});

const isOpen = ref(false);
const wrapper = ref(null);

function handleFocusOut(event) {
  if (!wrapper.value.contains(event.relatedTarget)) {
    isOpen.value = false;
  }
}
</script>

<style scoped lang="scss">
.overflow-menu-wrapper {
  position: relative;
  display: inline-block;

  .popover__container {
    --z-index: var(--z__popup);
  }

  .label {
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .overflow-menu-inner-wrapper {
    background-color: var(--color__surface--emphasis);
    border: 2px solid var(--color__border-divider--opaque);
    border-radius: calc(var(--rounding--B) * 0.95);
    min-height: var(--min-dimension);
    min-width: 100%;
    width: max-content;
    height: max-content;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 120ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overflow-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing--A);
  padding: var(--spacing--B);

  > *:is(hr) {
    margin-block: var(--spacing--A);
    border-color: var(--color__border-divider--opaque);
  }

  > *:is(button, .button) {
    flex: 1;
    justify-content: start;
  }
}
</style>
