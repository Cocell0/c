<template>
  <button @click="isOpen = !isOpen">
    <span class="i-material-symbols:share" aria-hidden inert></span>Share chat
  </button>
  <Modal v-model:open="isOpen" title="Share chat">
    <p>Share chat! ☺</p>
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
</script>
