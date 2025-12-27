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
    const options = Object.create(
      Object.getPrototypeOf(props.config),
      Object.getOwnPropertyDescriptors(props.config),
    );

    options.containerStyle =
      "background: transparent; width: 100%; height: 100%;";
    options.messageFeedStyle =
      "background: transparent; display: flex; flex-direction: column; padding: 0.4rem;";
    options.messageBubbleStyle = "padding: 0.6rem; background: transparent;";
    options.hideFullscreenButton = true;

    chat.value = window.plugins.commentsPlugin(options);
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
