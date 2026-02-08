<template>
  <button @click="isOpen = !isOpen">
    <span class="i-material-symbols:share" aria-hidden inert></span>Share chat
  </button>
  <Modal v-model:open="isOpen" title="Share chat" class="modal">
    <div class="row">
      <label for="recipent-public-key">Recipent's public key:</label>
      <input type="text" id="recipent-public-key" placeholder="Public key" />
    </div>

    <p class="status">status</p>

    <template #actions>
      <button @click="isOpen = false">Cancel</button>
      <button @click="handleShare">Share</button>
    </template>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Modal from "core/src/vue/components/Modal.vue";

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});

const isOpen = ref(false);

function getId(url) {
  const id = url.split("/").pop().split(".")[0];
  return id;
}
</script>
<style lang="scss" scoped>
.row {
  display: flex;
  flex-direction: column;

  label {
    font-weight: bold;
  }
}

p.status {
  margin-block: calc(var(--spacing) * 10);
  text-align: center;
}

:deep(.modal) {
  height: max-content;
}
</style>
