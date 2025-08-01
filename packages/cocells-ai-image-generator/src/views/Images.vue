<template>
  <div>
    <p>View for generated images</p>
    <AnchorLink href="/images/create">Create new images</AnchorLink>
  </div>
</template>

<script setup>
import AnchorLink from 'core/src/vue/components/AnchorLink.vue';
</script>

<style scoped>
div {
  padding: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>