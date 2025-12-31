<template>
  <section
    class="chat-panel"
    v-for="chat in chats"
    :key="chat.key"
    v-show="currentChat && chat.key === currentChat.key"
    :aria-label="`Chat ${chat.name}`"
  >
    <div
      style="
        display: flex;
        align-items: center;
        padding: var(--spacing--C);
        gap: var(--spacing--B);
      "
    >
      <AnchorLink href="/c" class="button button--icon">
        <span
          class="i-material-symbols:arrow-back-rounded"
          aria-hidden="true"
          translate="no"
          inert
        ></span>
      </AnchorLink>
      <h3
        class="chat-name"
        style="
          line-height: normal;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          flex: 1;
        "
      >
        {{ chat.name }}
      </h3>
      <button
        class="button--icon"
        aria-label="Edit chat's properties"
        title="Edit chat's properties"
      >
        <span
          class="i-material-symbols:edit-rounded"
          aria-hidden="true"
          translate="no"
          inert
        ></span>
      </button>
    </div>
    <Chat
      :config="{
        channel: chat.channel,
        channelLabel: chat.name,
        adminPassword:
          '54aeb8a29d48e5c37d39fe9a39c2eb5f190f1cd896b3ca3b24e974c066cbd8f8',
      }"
    />
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import AnchorLink from "core/src/vue/components/AnchorLink.vue";
import Chat from "@/components/Chat.vue";
import { useChatsStore } from "../store/useChatsStore";

const props = defineProps({
  chatKey: {
    type: String,
    required: false,
  },
});

const chatsStore = useChatsStore();

function getChat(key) {
  const chat = chatsStore.allChats.find((chat) => chat.key === key);

  return chat;
}

const chats = ref([]);
const currentChat = ref(null);

const chatConfigs = computed(() =>
  chats.value.map((chat) => ({
    chatKey: chat.key,
    config: {
      channel: chat.channel,
      channelLabel: chat.name,
      adminPassword:
        "54aeb8a29d48e5c37d39fe9a39c2eb5f190f1cd896b3ca3b24e974c066cbd8f8",
    },
  })),
);

watch(
  () => props.chatKey,
  () => {
    if (!props.chatKey) {
      currentChat.value = null;
      return;
    }

    const chat = getChat(props.chatKey);
    if (!chat) return;

    if (!chats.value.find((newChat) => newChat.key === chat.key)) {
      chats.value.push(chat);
    }

    if (!currentChat.value || props.chatKey !== currentChat.value.key) {
      currentChat.value = chat;
    }
  },
);
</script>
