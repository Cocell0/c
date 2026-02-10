<template>
  <button @click="isOpen = !isOpen">
    <span class="i-material-symbols:share" aria-hidden inert></span>Share chat
  </button>
  <Modal v-model:open="isOpen" title="Share chat" class="share-chat-modal">
    <div class="row">
      <label for="recipent-public-key">Recipent's public key:</label>
      <div class="column">
        <input type="text" id="recipent-public-key" placeholder="Public key" />
        <button class="button--icon">
          <span
            class="i-material-symbols:content-paste-rounded"
            aria-hidden
            inert
          >
          </span>
        </button>
      </div>
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

  .column {
    display: flex;
    align-items: center;
    gap: var(--spacing--A);

    input {
      flex: 1;
    }
  }
}

p.status {
  margin-block: calc(var(--spacing) * 10);
  text-align: center;
}

:global(.modal.share-chat-modal) {
  height: max-content;
}
</style>
