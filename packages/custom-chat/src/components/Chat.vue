<template>
  <div class="chat-container" v-html="chat"></div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
});

let chat = ref("");

function createChat() {
  if (!(import.meta.env.PROD && window.plugins?.commentsPlugin)) {
    chat.value = `${props.config.channelLabel} [Chat plugin not available]`;
  } else {
    chat.value = window.plugins.commentsPlugin(props.config);
  }
}

onMounted(() => {
  createChat();
});

watch(
  () => props.config.channel,
  () => {
    createChat();
  },
);
</script>
<style lang="scss">
.chat-container {
  width: 100%;
  height: 100%;

  .comments-plugin-ctn {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
