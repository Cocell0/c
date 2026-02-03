<template>
  <Tooltip
    :text="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
    :position="props.position"
    :tooltipStyle="props.tooltipStyle"
  >
    <button
      v-if="supportsFullscreen"
      class="button--icon"
      @click="toggleFullscreen"
      :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
    >
      <span
        :class="
          isFullscreen
            ? `i-material-symbols:close-fullscreen-rounded`
            : `i-material-symbols:fullscreen-rounded`
        "
      ></span>
    </button>
  </Tooltip>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Tooltip from "./Tooltip.vue";

const props = defineProps({
  position: {
    type: String,
    default: "bottom center",
  },
  tooltipStyle: {
    type: String,
  },
});

const supportsFullscreen = ref(
  document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled,
);
const isFullscreen = ref(false);

function toggleFullscreen() {
  if (isFullscreen.value) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
}
function enterFullscreen() {
  try {
    const htmlElement = document.documentElement;
    if (htmlElement.requestFullscreen) {
      htmlElement.requestFullscreen();
    } else if (htmlElement.mozRequestFullScreen) {
      htmlElement.mozRequestFullScreen();
    } else if (htmlElement.webkitRequestFullscreen) {
      htmlElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (htmlElement.msRequestFullscreen) {
      htmlElement.msRequestFullscreen();
    }
    isFullscreen.value = true;
  } catch (error) {
    console.error("Failed to enter fullscreen mode:", error);
    supportsFullscreen.value = false;
  }
}
function exitFullscreen() {
  try {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    isFullscreen.value = false;
  } catch (error) {
    console.error("Failed to exit fullscreen mode:", error);
    supportsFullscreen.value = false;
  }
}

function updateFullscreen() {
  isFullscreen.value = !!document.fullscreenElement;
}

onMounted(() => {
  document.addEventListener("fullscreenchange", updateFullscreen);
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", updateFullscreen);
});
</script>
