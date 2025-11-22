<template>
  <div class="chat-interface" :aria-label="`Chat: ${config.name}`">
    <div class="comments-plugin-chat" v-html="chat" inert aria-hidden></div>
    <ul class="messages" role="log" aria-live="polite" aria-relevant="additions">
      <li v-for="(comment, index) in messages" :key="index">
        <Message :comment="comment" />
      </li>
    </ul>
    <div class="input-area">
      <textarea class="message-input" rows="1" :placeholder="`Message ${config.name}`"
        :aria-label="`Message ${config.name}`" v-model="input"></textarea>
      <button class="button--icon" aria-label="Send message" :disabled="!input" @click="chat.submit(input)">
        <span class="i-material-symbols:send-rounded" aria-hidden="true" translate="no" inert></span>
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import Message from './Message.vue'

defineProps({
  config: {
    type: Object,
    required: true,
  },
})
const input = ref('');
const messages = ref([]);

const options = {
  channel: 'development',
  onLoad: (messages) => {
    messages.value = messages;
    console.log('onLoad', messages);
  },
  onComment: (message) => {
    messages.value.push(message);
  },
};

const chat = window.plugins.commentsPlugin(options);

</script>
<style lang="scss" scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .comments-plugin-chat {
    width: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
  }
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding-inline: var(--spacing--C);
  margin: 0;
  background-color: var(--color-background--light);

  li {
    list-style: none;
    display: flex;
    margin-bottom: var(--spacing--C);
    overflow-x: auto;

    .message-bubble {
      flex: 1;
    }
  }
}

.input-area {
  display: flex;
  padding: var(--spacing--B) var(--spacing--C);
  border-top: 1px solid var(--color__border-divider--opaque);
  background-color: var(--color-background--default);
  width: 100%;
  align-items: center;

  textarea {
    flex: 1;
    resize: none;
    background: none;
    border-radius: none;
  }
}
</style>