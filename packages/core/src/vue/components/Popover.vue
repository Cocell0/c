<template>
  <span class="popover__container" v-bind="props.containerAttributes">
    <span class="popover__anchor" v-bind="props.anchorAttributes">
      <component :is="children[0]"></component>
    </span>
    <span
      ref="content"
      class="popover__content"
      :data-position="position"
      v-bind="props.contentAttributes"
    >
      <component :is="children[1]"></component>
    </span>
  </span>
</template>

<script setup>
import { ref, useSlots, computed, onMounted } from "vue";

const contentElement = ref(null);
const position = ref(null);
const slots = useSlots();
const children = computed(() => {
  const nodes = slots.default ? slots.default() : [];
  return nodes.filter((node) => node.type !== Comment);
});

const props = defineProps({
  position: {
    type: String,
    default: "top",
  },
  containerAttributes: {
    type: Object,
    default: () => ({}),
  },
  anchorAttributes: {
    type: Object,
    default: () => ({}),
  },
  contentAttributes: {
    type: Object,
    default: () => ({}),
  },
});
function getPosition(position) {
  const validPositions = [
    "top",
    "top left",
    "top right",
    "bottom",
    "bottom left",
    "bottom right",
    "left",
    "left top",
    "left bottom",
    "right",
    "right top",
    "right bottom",
  ];
  if (!position.startsWith("auto"))
    return validPositions.includes(position) ? position : "top";
}
onMounted(() => {
  position.value = getPosition(props.position);
});
</script>

<style lang="scss" scoped>
.popover__container {
  --z-index: 200;
  --offset: var(--spacing--B);
  display: inline-block;
  position: relative;

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
}
</style>
