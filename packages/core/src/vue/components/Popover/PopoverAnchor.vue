<template>
  <span ref="anchorElement" class="popover__anchor">
    <slot />
  </span>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";

const anchorElement = ref(null);
const popover = inject("popover");

onMounted(() => {
  popover.anchorElement.value = anchorElement.value;
});
</script>

<style lang="scss" scoped>
.popover__anchor {
  display: inline-block;
}
</style>
