<template>
  <router-view />
  <!-- Defining ThemeSwitcher here to update the theme when the user switches themes -->
  <ThemeSwitcher style="position: fixed; visibility: hidden" inert />
</template>
<script setup>
import ThemeSwitcher from "core/src/vue/components/ThemeSwitcher.vue";
</script>
