<template>
  <a
    @keydown="onKeydown"
    @click="onClick"
    :href="'#' + href"
    :class="{ active: isActive }"
  >
    <slot />
  </a>
</template>

<script setup>
import { computed, ref, toRef } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
});

const href = toRef(props, "href");
const activeRoute = useRoute();

const isActive = computed(() => activeRoute.path === href.value);

function onKeydown(event) {
  const isSpaceKey =
    event.key === " " || event.key === "Spacebar" || event.code === "Space";
  const isEnterKey = event.key === "Enter";

  if (!isEnterKey && !isSpaceKey) return;

  event.preventDefault();

  const url =
    window.location.pathname + window.location.search + "#" + href.value;

  if (event.ctrlKey) {
    // This is to ensure that the link opens in a new tab or window
    // It had to be done because the default behavior no longer works properly in Perchance
    window.open(url, "_blank");
    // This will prevent Perchance from intercepting the event, and ensure that the link opens
    // in a new tab without changing the current hash
    event.stopImmediatePropagation();
  } else {
    window.location.hash = href.value;
  }
}

function onClick(event) {
  event.preventDefault();

  const url =
    window.location.pathname + window.location.search + "#" + href.value;

  if (event.ctrlKey) {
    // The same reason as before
    window.open(url, "_blank");
    // Same reason, same reason
    event.stopImmediatePropagation();
  } else {
    window.location.hash = href.value;
  }
}
</script>
