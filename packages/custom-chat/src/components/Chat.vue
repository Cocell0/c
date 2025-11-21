<template>
  <div class="chat-interface" :aria-label="`Chat: ${config.name}`">
    <ul class="messages" role="log" aria-live="polite" aria-relevant="additions">
      <li>
        <Message message="Example message 1" />
      </li>
      <li>
        <Message message="Example message 'nother" />
      </li>
      <li>
        <Message message="Abababababa" />
      </li>
      <li>
        <Message message="I like burgers" />
      </li>
      <li>
        <Message message="Cogito ergo sum." />
      </li>
      <li>
        <Message message="What??" />
      </li>
      <li>
        <Message message="Yes." />
      </li>
      <li>
        <Message message="bruhh 💀" />
      </li>
    </ul>
    <div class="input-area">
      <textarea class="message-input" rows="1" :placeholder="`Message ${config.name}`"
        :aria-label="`Message ${config.name}`" v-model="input"></textarea>
      <button class="button--icon" aria-label="Send message" :disabled="!input">
        <span class="i-material-symbols:send-rounded" aria-hidden="true" translate="no" inert></span>
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps } from 'vue';
import Message from './Message.vue'

defineProps({
  config: {
    type: Object,
    required: true,
  },
})
const input = ref('');
</script>
<style lang="scss" scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
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