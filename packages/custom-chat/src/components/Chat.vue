<template>
  <div class="chat-container" :class="{ 'opacity-0': !chatOpen, 'opacity-1': chatOpen }" v-html="chatHTML"></div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
});

let chat;
const chatHTML = ref('');
const chatOpen = ref(false);

const createChat = (channelId) => {
  if (import.meta.env.PROD && window.plugins?.commentsPlugin) {
    const options = {
      channel: channelId,
      containerStyle: "background: transparent; width: 100%; height: 100%;",
      messageFeedStyle: "background: transparent; display: flex; flex-direction: column; padding: 0.4rem;",
      messageBubbleStyle: "padding: 0.6rem;  margin: 0; background: transparent;",
      onLoad: () => {
        chatOpen.value = true;
      },
    };
    chat = window.plugins.commentsPlugin(options);
    chatHTML.value = chat;
  } else {
    chatHTML.value = `${channelId} [Chat plugin not available]`;
    chatOpen.value = true;
  }
};

onMounted(() => {
  createChat(props.config.id);
});

watch(
  () => props.config.id,
  (newId) => {
    chatHTML.value = import.meta.env.PROD && chat ? chat : `${newId} [Chat plugin not available]`;
    createChat(newId);
  }
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