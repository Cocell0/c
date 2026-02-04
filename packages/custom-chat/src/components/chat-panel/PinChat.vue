<template>
  <button v-if="!isPinned">
    <span class="i-material-symbols:keep-rounded" aria-hidden inert></span>Pin
    chat
  </button>
  <button v-else>
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
const isPinned = ref(false);

async function pinChat() {
  try {
    // To be added
  } catch (error) {
    alert(
      "Error pinning:\n" +
        (error instanceof Error ? error.message : String(error)),
    );
    return;
  }
}
</script>
