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
const emit = defineEmits(["rename"]);
const chatsStore = useChatsStore();

async function renameChat() {
  const newName = prompt("Enter the new chat name:")?.trim();
  if (!newName) return;

  try {
    await chatsStore.renameChat(props.chat.key, newName);
    emit("rename", props.chat.key);
  } catch (error) {
    alert(
      "Error renaming:\n" +
        (error instanceof Error ? error.message : String(error)),
    );
    return;
  }
}
</script>
