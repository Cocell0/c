<template>
  <button
    @click="toggle"
    class="button--icon"
    :aria-label="
      theme === 0
        ? 'Change theme: Switch to light mode'
        : theme === 1
          ? 'Change theme: Switch to dark mode'
          : 'Change theme: Let the system decide'
    "
    :title="
      theme === 0
        ? 'Change theme: Switch to light mode'
        : theme === 1
          ? 'Change theme: Switch to dark mode'
          : 'Change theme: Let the system decide'
    "
  >
    <span
      :class="
        theme === 0
          ? 'i-material-symbols:sunny-rounded'
          : theme === 1
            ? 'i-material-symbols:dark-mode-rounded'
            : 'i-material-symbols:sync-rounded'
      "
    ></span>
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const themeChannel = new BroadcastChannel("theme-switcher-channel");

/**
 * A reactive state variable to track the current theme state.
 * @enum {number} 0 = system, 1 = light, 2 = dark
 */
const theme = ref(Number(localStorage.getItem("themeSwitcherTheme")) || 0);

function shouldSkipTransition() {
  return (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getTransitionCoordinates(event) {
  const hasPointerCoordinates =
    typeof event?.clientX === "number" &&
    typeof event?.clientY === "number" &&
    (event.clientX !== 0 || event.clientY !== 0);

  const x = hasPointerCoordinates ? event.clientX : innerWidth / 2;
  const y = hasPointerCoordinates ? event.clientY : innerHeight / 2;

  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );

  return { x, y, radius };
}

/**
 * Synchronously updates the DOM to match the theme.
 * Separated from watcher to ensure viewTransition captures the state immediately.
 */
function applyTheme(newTheme) {
  const isDark =
    newTheme === 2 ||
    (newTheme === 0 &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Apply attributes for CSS selectors
  document.documentElement.setAttribute(
    "data-theme",
    newTheme === 1 ? "light" : newTheme === 2 ? "dark" : "",
  );
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";

  return isDark;
}

function startThemeTransition(nextTheme, x, y, radius) {
  const transition = document.startViewTransition(() => {
    theme.value = nextTheme;
    // Explicitly update DOM here so the 'new' snapshot is correct
    applyTheme(nextTheme);
  });

  transition.ready.then(() => {
    // We calculate isDarkMode based on the *destination* visual state
    const isDarkMode =
      nextTheme === 2 ||
      (nextTheme === 0 &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const clip = isDarkMode
      ? [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
      : [
          `circle(${radius}px at ${x}px ${y}px)`,
          `circle(0px at ${x}px ${y}px)`,
        ];

    document.documentElement.animate(
      { clipPath: clip },
      {
        duration: 250,
        easing: "ease-in-out",
        fill: "forwards",
        pseudoElement: isDarkMode
          ? "::view-transition-new(root)"
          : "::view-transition-old(root)",
      },
    );
  });
}

function toggle(event) {
  const nextTheme = (theme.value + 1) % 3;
  const isSystemDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  // Skip if user prefers light mode and current theme is System (0),
  // or if user prefers dark mode and current theme is Dark (2)
  // This is done to prevent unnecessary transitions.
  const explicitSkip =
    (!isSystemDark && theme.value === 0) || (isSystemDark && theme.value === 2);

  if (explicitSkip || shouldSkipTransition()) {
    theme.value = nextTheme;
    applyTheme(nextTheme);
    return;
  }

  const { x, y, radius } = getTransitionCoordinates(event);
  startThemeTransition(nextTheme, x, y, radius);
}

// Watcher primarily for persistence and cross-tab synchronization
watch(theme, (newValue) => {
  localStorage.setItem("themeSwitcherTheme", newValue);
  themeChannel.postMessage(newValue);
  // Redundant safety call, harmless if DOM is already updated by toggle
  applyTheme(newValue);
});

onMounted(() => {
  applyTheme(theme.value);

  const themePreference = window.matchMedia("(prefers-color-scheme: dark)");

  themePreference.addEventListener("change", (event) => {
    applyTheme(theme.value);
  });
});

themeChannel.onmessage = (event) => {
  theme.value = event.data;
  applyTheme(theme.value);
};
</script>

<style>
:root {
  will-change: color, background, filter, animation, clip-path, transform;
}
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 9999;
}

::view-transition-new(root) {
  z-index: 9998;
}

[data-theme="dark"]::view-transition-old(root) {
  z-index: 9998;
}

[data-theme="dark"]::view-transition-new(root) {
  z-index: 9999;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
  }
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none !important;
    filter: none !important;
  }
}

.i-material-symbols\:sunny-rounded {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M12 5q-.425 0-.712-.288T11 4V2q0-.425.288-.712T12 1t.713.288T13 2v2q0 .425-.288.713T12 5m4.95 2.05q-.275-.275-.275-.687t.275-.713l1.4-1.425q.3-.3.712-.3t.713.3q.275.275.275.7t-.275.7L18.35 7.05q-.275.275-.7.275t-.7-.275M20 13q-.425 0-.713-.288T19 12t.288-.712T20 11h2q.425 0 .713.288T23 12t-.288.713T22 13zm-8 10q-.425 0-.712-.288T11 22v-2q0-.425.288-.712T12 19t.713.288T13 20v2q0 .425-.288.713T12 23M5.65 7.05l-1.425-1.4q-.3-.3-.3-.725t.3-.7q.275-.275.7-.275t.7.275L7.05 5.65q.275.275.275.7t-.275.7q-.3.275-.7.275t-.7-.275m12.7 12.725l-1.4-1.425q-.275-.3-.275-.712t.275-.688t.688-.275t.712.275l1.425 1.4q.3.275.288.7t-.288.725q-.3.3-.725.3t-.7-.3M2 13q-.425 0-.712-.288T1 12t.288-.712T2 11h2q.425 0 .713.288T5 12t-.288.713T4 13zm2.225 6.775q-.275-.275-.275-.7t.275-.7L5.65 16.95q.275-.275.687-.275t.713.275q.3.3.3.713t-.3.712l-1.4 1.4q-.3.3-.725.3t-.7-.3M12 18q-2.5 0-4.25-1.75T6 12t1.75-4.25T12 6t4.25 1.75T18 12t-1.75 4.25T12 18'/%3E%3C/svg%3E");
  -webkit-mask: var(--un-icon) no-repeat;
  mask: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: inherit;
  width: 1em;
  height: 1em;
}

.i-material-symbols\:dark-mode-rounded {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M12 21q-3.775 0-6.387-2.613T3 12q0-3.45 2.25-5.988T11 3.05q.325-.05.575.088t.4.362t.163.525t-.188.575q-.425.65-.638 1.375T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q.775 0 1.538-.225t1.362-.625q.275-.175.563-.162t.512.137q.25.125.388.375t.087.6q-.35 3.45-2.937 5.725T12 21'/%3E%3C/svg%3E");
  -webkit-mask: var(--un-icon) no-repeat;
  mask: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: inherit;
  width: 1em;
  height: 1em;
}

.i-material-symbols\:sync-rounded {
  --un-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M6 12.05q0 1.125.425 2.188T7.75 16.2l.25.25V15q0-.425.288-.712T9 14t.713.288T10 15v4q0 .425-.288.713T9 20H5q-.425 0-.712-.288T4 19t.288-.712T5 18h1.75l-.4-.35q-1.3-1.15-1.825-2.625T4 12.05Q4 9.7 5.2 7.787T8.425 4.85q.35-.2.738-.025t.512.575q.125.375-.012.75t-.488.575q-1.45.8-2.312 2.213T6 12.05m12-.1q0-1.125-.425-2.187T16.25 7.8L16 7.55V9q0 .425-.288.713T15 10t-.712-.288T14 9V5q0-.425.288-.712T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6h-1.75l.4.35q1.225 1.225 1.788 2.663T20 11.95q0 2.35-1.2 4.263t-3.225 2.937q-.35.2-.737.025t-.513-.575q-.125-.375.013-.75t.487-.575q1.45-.8 2.313-2.212T18 11.95'/%3E%3C/svg%3E");
  -webkit-mask: var(--un-icon) no-repeat;
  mask: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: inherit;
  width: 1em;
  height: 1em;
}
</style>
