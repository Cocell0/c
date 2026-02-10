<template>
  <span class="popover__container">
    <slot />
  </span>
</template>

<script setup>
import { ref, provide, watch, onMounted, onUnmounted } from "vue";

const anchorElement = ref(null);
const contentElement = ref(null);
const position = ref(null);

provide("popover", { anchorElement, contentElement, position });

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
function updatePosition() {
  position.value = getPosition(props.position);
}
onMounted(() => {
  window.addEventListener("resize", updatePosition);
  const resizeObserver = new ResizeObserver(updatePosition);

  if (anchorElement.value) resizeObserver.observe(anchorElement.value);
  if (contentElement.value) resizeObserver.observe(contentElement.value);

  onUnmounted(() => {
    window.removeEventListener("resize", updatePosition);
    resizeObserver.disconnect();
  });
});
</script>

<style lang="scss" scoped>
.popover__container {
  --z-index: 200;
  --offset: var(--spacing--B);
  display: inline-block;
  position: relative;
}
</style>
