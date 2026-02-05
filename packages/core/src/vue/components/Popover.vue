<template>
  <span class="popover__container" v-bind="props.containerAttributes">
    <span
      ref="anchorElement"
      class="popover__anchor"
      v-bind="props.anchorAttributes"
    >
      <component :is="children[0]"></component>
    </span>
    <span
      ref="contentElement"
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
const anchorElement = ref(null);
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

  const [_, preferredPosition] = position.split(" ");

  if (!contentElement.value)
    return preferredPosition && validPositions.includes(preferredPosition)
      ? preferredPosition
      : "top";

  if (!anchorElement.value)
    return preferredPosition && validPositions.includes(preferredPosition)
      ? preferredPosition
      : "top";

  const anchorRect = anchorElement.value.getBoundingClientRect();
  const contentRect = contentElement.value.getBoundingClientRect();
  const contentWidth =
    contentRect.width ||
    contentElement.value.offsetWidth ||
    contentElement.value.clientWidth ||
    0;
  const contentHeight =
    contentRect.height ||
    contentElement.value.offsetHeight ||
    contentElement.value.clientHeight ||
    0;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  function placementCoordinatesFor(candidatePosition) {
    switch (candidatePosition) {
      case "top":
        return {
          top: anchorRect.top - contentHeight,
          left: anchorRect.left + (anchorRect.width - contentWidth) / 2,
        };
      case "top left":
        return { top: anchorRect.top - contentHeight, left: anchorRect.left };
      case "top right":
        return {
          top: anchorRect.top - contentHeight,
          left: anchorRect.right - contentWidth,
        };
      case "bottom":
        return {
          top: anchorRect.bottom,
          left: anchorRect.left + (anchorRect.width - contentWidth) / 2,
        };
      case "bottom left":
        return { top: anchorRect.bottom, left: anchorRect.left };
      case "bottom right":
        return {
          top: anchorRect.bottom,
          left: anchorRect.right - contentWidth,
        };
      case "left":
        return {
          top: anchorRect.top + (anchorRect.height - contentHeight) / 2,
          left: anchorRect.left - contentWidth,
        };
      case "left top":
        return { top: anchorRect.top, left: anchorRect.left - contentWidth };
      case "left bottom":
        return {
          top: anchorRect.bottom - contentHeight,
          left: anchorRect.left - contentWidth,
        };
      case "right":
        return {
          top: anchorRect.top + (anchorRect.height - contentHeight) / 2,
          left: anchorRect.right,
        };
      case "right top":
        return { top: anchorRect.top, left: anchorRect.right };
      case "right bottom":
        return {
          top: anchorRect.bottom - contentHeight,
          left: anchorRect.right,
        };
      default:
        return {
          top: anchorRect.top - contentHeight,
          left: anchorRect.left + (anchorRect.width - contentWidth) / 2,
        };
    }
  }

  function fitsInViewport(candidateCoords) {
    if (Number.isNaN(candidateCoords.top) || Number.isNaN(candidateCoords.left))
      return false;
    const withinLeft = candidateCoords.left >= 0;
    const withinTop = candidateCoords.top >= 0;
    const withinRight = candidateCoords.left + contentWidth <= viewportWidth;
    const withinBottom = candidateCoords.top + contentHeight <= viewportHeight;
    return withinLeft && withinTop && withinRight && withinBottom;
  }

  if (preferredPosition && validPositions.includes(preferredPosition)) {
    const preferredCoords = placementCoordinatesFor(preferredPosition);
    if (fitsInViewport(preferredCoords)) return preferredPosition;
  }

  for (const candidatePosition of validPositions) {
    const candidateCoords = placementCoordinatesFor(candidatePosition);
    if (fitsInViewport(candidateCoords)) return candidatePosition;
  }

  return preferredPosition && validPositions.includes(preferredPosition)
    ? preferredPosition
    : "top";
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
