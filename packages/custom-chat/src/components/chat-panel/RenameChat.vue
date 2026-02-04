<template>
  <button @click="renameChat">
    <span class="i-material-symbols:edit-rounded" aria-hidden inert></span>
    Rename chat
  </button>
</template>

<script setup>
import { useChatsStore } from "@/stores/useChatsStore";

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});
const chatsStore = useChatsStore();

async function renameChat() {
  const newName = prompt("Enter the new chat name:")?.trim();
  if (!newName) return;

  try {
    await chatsStore.renameChat(props.chat.key, newName);
  } catch (error) {
    alert(error instanceof Error ? error.message : String(error));
    return;
  }
}
</script>
