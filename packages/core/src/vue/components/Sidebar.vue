<template>
  <div class="sidebar" :class="{ 'sidebar--open': isOpen }" :inert="!isOpen" role="complementary"
    :aria-expanded="isOpen ? 'true' : 'false'">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  open: Boolean
})

const isOpen = computed(() => props.open)
</script>

<style scoped lang="scss">
.sidebar {
  width: 0;
  height: 100%;
  overflow: hidden;
  background: var(--surface);
  border-radius: var(--space-B);

  .content {
    width: var(--width-small);
    padding: var(--space-B);
    overflow-y: auto;
    height: 100%;
    overflow-x: hidden;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--z-overlay);
  }

  .right {
    left: auto;
    right: 0;
  }
}

.sidebar.sidebar--open {
  width: var(--width-small);
}
</style>