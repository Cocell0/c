<template>
  <button v-if="!isPinned" @click="pinChat(true)">
    <span class="i-material-symbols:keep-rounded" aria-hidden inert></span>Pin
    chat
  </button>
  <button v-else @click="pinChat(false)">
    <span class="i-material-symbols:keep-off-rounded" aria-hidden inert></span
    >Unpin chat
  </button>
</template>

<script setup>
import { ref } from "vue";
import { useChatsStore } from "@/stores/useChatsStore";

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["pin"]);
const chatsStore = useChatsStore();
const isPinned = ref(props.chat.metadata.pinned);

async function pinChat(value) {
  try {
    await chatsStore.updateMetadata(props.chat.key, {
      pinned: value,
      pinnedAt: value == true ? Date.now() : 0,
    });
    isPinned.value = value;
  } catch (error) {
    alert(
      "Error:\n" + (error instanceof Error ? error.message : String(error)),
    );
    return;
  }
}
</script>
