<template>
  <div class="chat-container" v-html="chatHTML"></div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
});

let chat;
const chatHTML = ref("");

const createChat = (channel) => {
  if (import.meta.env.PROD && window.plugins?.commentsPlugin) {
    const options = {
      channel: channel,
      adminPasswordHash: props.config.adminPassword || undefined,
      adminFlair: props.config.adminFlair || undefined,
      bannedWords: props.config.bannedWords || undefined,
      containerStyle: "background: transparent; width: 100%; height: 100%;",
      messageFeedStyle:
        "background: transparent; display: flex; flex-direction: column; padding: 0.4rem;",
      messageBubbleStyle: "padding: 0.6rem; background: transparent;",
    };
    chat = window.plugins.commentsPlugin(options);
    chatHTML.value = chat;
  } else {
    chatHTML.value = `${channel} [Chat plugin not available]`;
  }
};

onMounted(() => {
  createChat(props.config.channel);
  document.title = props.config.name;
});

watch(
  () => props.config.channel,
  (newChannel) => {
    chatHTML.value =
      import.meta.env.PROD && chat
        ? chat
        : `${newChannel} [Chat plugin not available]`;
    createChat(newChannel);
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
