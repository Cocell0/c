<template>
  <div class="chat-interface" :aria-label="`Chat: ${props.config.name}`" role="region">
    <div class="comments-plugin-chat" v-html="chatHtml" inert aria-hidden></div>
    <DynamicScroller :items="comments" :min-item-size="50" key-field="id" ref="messageContainer" class="messages"
      role="log" aria-live="polite" aria-relevant="additions">
      <template #default="{ item, index, active }">
        <DynamicScrollerItem :item="item" :index="index" active="active" class="message-wrapper">
          <Message :comment="item" />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
    <div class="input-area">
      <textarea class="message-input" rows="1" :placeholder="`Message ${props.config.name}`"
        :aria-label="`Message ${props.config.name}`" v-model="input"></textarea>
      <div class="send-button-container">
        <button class="button--icon" aria-label="Send message" :disabled="!input" @click="sendMessage">
          <span class="i-material-symbols:send-rounded" aria-hidden="true" translate="no" inert></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import Message from './MessageOld.vue';

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
});

const input = ref('');
const comments = ref([]);
const chatHtml = ref('');
let chat;
const messageContainer = ref(null);

const createChat = async (channelId) => {
  const options = {
    channel: channelId,
    onLoad: async (loadedComments) => {
      comments.value = loadedComments;
      await nextTick();
      messageContainer.value.scrollToBottom()
    },
    onComment: (newComment) => {
      comments.value.push(newComment);
    }
  };

  chat = window.plugins.commentsPlugin(options);
  chatHtml.value = chat;
};

onMounted(() => {
  createChat(props.config.id);
});

watch(
  () => props.config.id,
  (newId) => {
    comments.value = [];
    chatHtml.value = chat;
    createChat(newId);
  }
);

const sendMessage = async () => {
  if (!chat || !input.value) return;
  chat.submit(input.value);
  input.value = '';
};
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

  .message-wrapper {
    display: flex;
    padding-bottom: var(--spacing--C);
    overflow-x: auto;

    .message-bubble {
      flex: 1;
    }
  }
}

.input-area {
  display: flex;
  border-top: 1px solid var(--color__border-divider--opaque);
  background-color: var(--color-background--default);
  width: 100%;
  align-items: center;

  >* {
    height: 100%;
  }

  textarea {
    flex: 1;
    resize: none;
    background: none;
    border-radius: 0;
  }

  .send-button-container {
    display: flex;
    align-items: center;
    padding: var(--spacing--C);
  }
}
</style>