<template>
  <Popover
    :position="props.position"
    class="overflow-menu-wrapper"
    ref="wrapper"
    @keydown.esc="isOpen = false"
    @focusout="handleFocusOut"
  >
    <PopoverAnchor>
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
        ></span></button
    ></PopoverAnchor>

    <Transition name="overflow-menu">
      <PopoverContent
        v-show="isOpen && $slots.default"
        class="overflow-menu-inner-wrapper"
        :class="props.position"
        :style="props.menuStyle"
      >
        <div class="overflow-menu" role="menu">
          <slot></slot>
        </div>
      </PopoverContent>
    </Transition>
  </Popover>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import Popover from "./Popover/Popover.vue";
import PopoverAnchor from "./Popover/PopoverAnchor.vue";
import PopoverContent from "./Popover/PopoverContent.vue";

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

function closeMenu(event) {
  if (event.target.closest(".overflow-menu")) {
    return;
  }
  isOpen.value = false;
}
function handleFocusOut(event) {
  if (!wrapper.value.$el.contains(event.relatedTarget)) {
    isOpen.value = false;
  }
}

watch(isOpen, (value) => {
  if (value) {
    window.addEventListener("scroll", closeMenu, true);
  } else {
    window.removeEventListener("scroll", closeMenu, true);
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", closeMenu, true);
});
</script>

<style scoped lang="scss">
.overflow-menu-wrapper {
  position: relative;
  display: inline-block;
  --z-index: var(--z__popup);

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
    min-height: var(--size__control--min);
    min-width: 100%;
    width: max-content;
    height: max-content;
    overflow: hidden;
  }
}

.overflow-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing--A);
  padding: var(--spacing--B);
  overflow-y: auto;
  scrollbar-width: none;
  max-height: 80vh;
  max-height: 80dvh;

  > *:is(hr) {
    margin-block: var(--spacing--A);
    border-color: var(--color__border-divider--opaque);
  }

  > *:is(button, .button) {
    flex: 1;
    justify-content: start;
    --rn: calc(var(--rounding--A) * 0.5); // Nested rounding

    &:not(:only-child) {
      border-radius: var(--rn) var(--rn);

      &:first-child {
        border-radius: var(--rounding--A) var(--rounding--A) var(--rn) var(--rn);
      }
      &:last-child {
        border-radius: var(--rn) var(--rn) var(--rounding--A) var(--rounding--A);
      }
    }
  }
}

.overflow-menu-enter-active,
.overflow-menu-leave-active {
  transition:
    opacity 120ms ease,
    transform 120ms ease;
}

.overflow-menu-enter-from,
.overflow-menu-leave-to {
  opacity: 0;
}
</style>
