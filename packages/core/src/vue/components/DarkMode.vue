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
  if (!document.startViewTransition) {
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
  transition-property: filter, background, color !important;
  transition-duration: 0.25s !important;
  transition-timing-function: cubic-bezier(0.46, 0.46, 0, 1.15) !important;
}
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 9999;
  filter: blur(4px);
}

::view-transition-new(root) {
  z-index: 9998;
}

[dark]::view-transition-old(root) {
  z-index: 9998;
  filter: blur(4px);
}

[dark]::view-transition-new(root) {
  z-index: 9999;
}

[dark]::view-transition-old(root)::after {
  z-index: 9998;
  filter: blur(4px);
}
</style>
