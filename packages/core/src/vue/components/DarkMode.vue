<template>
  <button @click="toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" style="padding: var(---space-S);">
    <span v-if="isDark" class="i-material-symbols-sunny-rounded"></span>
    <span v-else class="i-material-symbols-dark-mode-rounded"></span>
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const themeChannel = new BroadcastChannel('theme')
const isDark = ref(false)

themeChannel.onmessage = ({ data }) => {
  if (data === 'dark' || data === 'light') {
    isDark.value = data === 'dark'
    updateTheme(false)
  }
}

watch(isDark, v => themeChannel.postMessage(v ? 'dark' : 'light'))

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) isDark.value = saved === 'dark'
  else {
    isDark.value = matchMedia('(prefers-color-scheme: dark)').matches
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
  updateTheme(false)

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
      updateTheme(false)
    }
  })
})

const updateTheme = (withTransition = true) => {
  document.documentElement.toggleAttribute('dark', isDark.value)
  document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')

  if (withTransition && document.startViewTransition) {
    document.startViewTransition(() => {
      document.documentElement.toggleAttribute('dark', isDark.value)
      document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
    })
  }
}

const toggle = e => {
  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isDark.value = !isDark.value
    updateTheme(false)
    return
  }

  const x = e.clientX || innerWidth / 2
  const y = e.clientY || innerHeight / 2
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  const transition = document.startViewTransition(() => {
    isDark.value = !isDark.value
    updateTheme(false)
  })

  transition.ready.then(() => {
    const clip = isDark.value
      ? [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`]
      : [`circle(${r}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`]

    document.documentElement.animate(
      { clipPath: clip },
      {
        duration: 250,
        easing: 'ease-in-out',
        pseudoElement: isDark.value
          ? '::view-transition-new(root)'
          : '::view-transition-old(root)'
      }
    )
  })
}
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

[dark]::view-transition-old(root) {
  z-index: 9998;
}

[dark]::view-transition-new(root) {
  z-index: 9999;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
  }
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none !important;
    filter: none !important;
  }
}

.i-material-symbols-sunny-rounded {
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

.i-material-symbols-dark-mode-rounded {
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
</style>
