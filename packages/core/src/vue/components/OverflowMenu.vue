<template>
  <span
    class="overflow-menu-wrapper"
    ref="wrapper"
    @keydown.esc="isOpen = false"
    @focusout="handleFocusOut"
  >
    <button
      ref="button"
      :class="props.label ? '' : 'button--icon'"
      :aria-label="props.ariaLabel"
      :title="props.title"
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
        :style="props.style"
      >
        <div class="overflow-menu" role="menu" @click="isOpen = false">
          <slot></slot>
        </div>
      </div>
    </Transition>
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
  label: {
    type: String,
  },
  disable: {
    type: Boolean,
    default: false,
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

  .label {
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .overflow-menu-inner-wrapper {
    position: absolute;
    margin-block: var(--spacing--A);
    background-color: var(--color__surface--emphasis);
    border: 2px solid var(--color__border-divider--opaque);
    border-radius: calc(var(--rounding--A) * 1.155);
    min-height: var(--min-dimension);
    min-width: 100%;
    width: max-content;
    z-index: 1;
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

  :deep(> *) {
    flex: 1;
  }
}
</style>
