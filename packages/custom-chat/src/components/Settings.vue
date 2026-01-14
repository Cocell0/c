<template>
  <button
    class="button--icon"
    @click="isOpen = true"
    aria-label="Open settings"
  >
    <span class="i-material-symbols:settings-rounded"></span>
  </button>
  <Modal v-model:open="isOpen" title="Settings">
    <p>Settings contents</p>
  </Modal>
</template>
<script setup>
import { ref } from "vue";
import Modal from "core/src/vue/components/Modal.vue";

const isOpen = ref(false);
</script>
<style scoped lang="scss">
.modal {
  max-width: clamp(300px, 90%, 68dvw);
  max-height: clamp(200px, 80%, 92dvh);
}
</style>
