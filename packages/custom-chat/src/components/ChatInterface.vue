<template>
  <div class="chat-interface" :aria-label="`Chat: ${config.name}`">
    <div class="messages" role="log" aria-live="polite" aria-relevant="additions"></div>
    <div class="input-area">
      <textarea class="message-input" rows="1" placeholder="Type your message..."
        aria-label="Type your message"></textarea>
      <button class="button--icon" aria-label="Send message">
        <span class="i-material-symbols:send-rounded" aria-hidden="true" translate="no" inert></span>
      </button>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';

defineProps({
  config: {
    type: Object,
    required: true
  },
});
</script>
<style lang="scss">
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
  padding: var(--spacing--C);
  background-color: var(--color-background--light);
}
</style>