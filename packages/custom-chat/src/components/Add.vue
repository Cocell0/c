<template>
  <button class="button--icon" @click="add()">
    <span
      class="i-material-symbols:add-2-rounded"
      aria-hidden="true"
      translate="no"
      inert
    ></span>
  </button>
</template>

<script setup>
import { ref, computed } from "vue";
import { useChatsStore } from "../store/useChatsStore";

const chatsStore = useChatsStore();

const chats = computed(() => [
  ...chatsStore.globalChats,
  ...chatsStore.savedChats,
]);

function generateName() {
  let name;
  do {
    name = `#${Math.floor(1000 + Math.random() * 9000)}`;
  } while (chats.value.some((c) => c.name === name));
  return name;
}

function add() {
  chatsStore.addChat({
    id: crypto.randomUUID(),
    name: generateName(),
  });
}
</script>
