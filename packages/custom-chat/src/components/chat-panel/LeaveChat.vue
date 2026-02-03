<template>
  <button @click="deleteChat">
    <span class="i-material-symbols:logout-rounded" aria-hidden inert></span>
    Leave chat
  </button>
</template>

<script setup>
import { useChatsStore } from "@/stores/useChatsStore";

const chatsStore = useChatsStore();
const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});

async function deleteChat() {
  if (
    confirm(
      `Are you sure you want to leave the chat ${props.chat.name}?\n\nLeaving will remove this chat from your device, but it will remain on the device of everyone else who have been part of this chat.`,
    ) &&
    prompt(
      `Are you really, really sure? This CANNOT be undone.\n\nType "yes" to show you are serious.`,
    )?.toLowerCase() === "yes"
  ) {
    try {
      await chatsStore.deleteChat(props.chat.key);
      window.location.hash = "#/c";
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
      return;
    }
  }
}
</script>
