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
      <AnchorLink
        href="/c"
        class="button button--icon chat-back-button"
        aria-label="Go back"
        title="Go back"
      >
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
      <Edit v-if="!chat.system" :chat="chat" @update:edited="handleEdit" />
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
import { computed, onMounted, ref, watch } from "vue";
import AnchorLink from "core/src/vue/components/AnchorLink.vue";
import Chat from "@/components/Chat.vue";
import Edit from "@/components/Edit.vue";
import { useChatsStore } from "../store/useChatsStore";

const props = defineProps({
  chatKey: {
    type: String,
    required: false,
  },
});

const chatsStore = useChatsStore();
const allChats = computed(() => chatsStore.allChats);

function getChat(key) {
  return allChats.value.find((chat) => chat.key === key);
}

const chats = ref([]);
const currentChat = ref(null);

function addChat(key) {
  if (!key) {
    currentChat.value = null;
    return;
  }

  const chat = getChat(key);
  if (!chat) return;

  if (!chats.value.find((newChat) => newChat.key === chat.key)) {
    chats.value.push(chat);
  }

  if (!currentChat.value || key !== currentChat.value.key) {
    currentChat.value = chat;
  }
}
function handleEdit(key) {
  const editedChat = getChat(key);
  if (!editedChat) return;

  currentChat.value = editedChat;
  chats.value = chats.value.map((chat) =>
    chat.key === editedChat.key ? editedChat : chat,
  );
}

onMounted(async () => {
  await chatsStore.loadUserChats();
  addChat(props.chatKey);
});
watch(
  () => props.chatKey,
  async () => {
    await chatsStore.loadUserChats();
    addChat(props.chatKey);
  },
);
</script>
