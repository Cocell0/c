<template>
  <div style="
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ">
    <h2>Home</h2>
    <AnchorLink href="/c" class="button">Chat</AnchorLink>
  </div>
</template>

<script setup>
import AnchorLink from 'core/src/vue/components/AnchorLink.vue'
</script>