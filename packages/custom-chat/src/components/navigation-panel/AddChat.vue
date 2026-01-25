<template>
  <button class="button--icon" @click="add()" title="Add a new chat">
    <span
      class="i-material-symbols:add-2-rounded"
      aria-hidden="true"
      translate="no"
      inert
    ></span>
  </button>
</template>

<script setup>
import { useChatsStore } from "@/stores/useChatsStore";
const chatsStore = useChatsStore();

function generateName() {
  let name;
  do {
    name = `#${Math.floor(1000 + Math.random() * 9000)}`;
  } while (chatsStore.allChats.some((c) => c.name === name));
  return name;
}

async function add() {
  const { key } = await chatsStore.addChat(generateName());
  window.location.hash = `#/c/${key}`;
}
</script>
