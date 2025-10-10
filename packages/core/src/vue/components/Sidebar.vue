<template>
  <div class="sidebar-wrapper">
    <div class="backdrop" @click="closeSidebar" :class="{ 'backdrop--show': showBackdrop }"></div>
    <div class="sidebar" :class="[
      'sidebar',
      { 'sidebar--open': isOpen, 'sidebar--left': props.position === 'left', 'sidebar--right': props.position === 'right' },
      attrs.class
    ]" v-bind="{ ...attrs, class: undefined }" :inert="!isOpen" :role="'complementary' || attrs.role"
      :aria-expanded="isOpen ? 'true' : 'false'">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>


<script setup>
defineOptions({ inheritAttrs: false })
import { computed, useAttrs, ref, onMounted, onUnmounted } from 'vue'
const attrs = useAttrs();

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value),
  },
})

const isOpen = computed(() => props.open);
const screenWidth = ref(window.innerWidth)
const emit = defineEmits(['open', 'close']);
const closeSidebar = () => emit('close');
const openSidebar = () => emit('open');
const toggleSidebar = () => isOpen.value ? closeSidebar() : openSidebar();


const showBackdrop = computed(() => {
  return screenWidth.value <= 768 && isOpen.value
})

onMounted(() => window.addEventListener('resize', () => {
  screenWidth.value = window.innerWidth
}))
onUnmounted(() => window.removeEventListener('resize', () => {
  screenWidth.value = window.innerWidth
}))
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  height: 100%;
}

.sidebar {
  width: 0;
  height: 100%;
  overflow: hidden;
  background: var(--color__surface);
  visibility: hidden;

  .content {
    width: var(--width-small);
    padding: var(--spacing--C);
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
    z-index: var(--z__overlay);
  }

  .sidebar--right {
    left: auto;
    right: 0;
  }
}

.sidebar.sidebar--open {
  width: var(--width-small);
  visibility: visible;
}
</style>