<template>
  <main>
    <ul class="chat-tabs">
      <li>
        <AnchorLink href="/c" class="button">All chats</AnchorLink>
      </li>
      <li v-for="chat in chats" :key="chat.id">
        <AnchorLink :href="`/c/${chat.id}`" class="button">{{ chat.name }}</AnchorLink>
      </li>
    </ul>
    <div v-if="id">
      <h2>{{ chat.name }}</h2>
      <!-- Chat content would go here -->
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useChatsStore } from '../store/useChatsStore';
import AnchorLink from 'core/src/vue/components/AnchorLink.vue';

const route = useRoute();
const id = computed(() => route.params.id);

const chatsStore = useChatsStore();
console.log(chatsStore.globalChats);

const chats = computed(() => [...chatsStore.globalChats, ...chatsStore.savedChats])
const chat = computed(() => chats.value.find(chat => chat.id === id.value))
</script>